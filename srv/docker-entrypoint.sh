#!/bin/sh
set -e

# URL encode function using node (only encode if contains special characters)
encode_url_if_needed() {
  local val="$1"
  # Check if value contains characters that need encoding
  if echo "$val" | grep -q '[^a-zA-Z0-9._-]'; then
    node -e "console.log(encodeURIComponent(process.argv[1]))" "$val"
  else
    echo "$val"
  fi
}

# Build DATABASE_URL from components
DB_USER_VAL="${DB_USER:-postgres}"
DB_PASSWORD_VAL="${DB_PASSWORD:-postgres}"
DB_NAME_VAL="${DB_NAME:-evimed}"
DB_HOST_VAL="${DB_HOST:-postgres}"
DB_PORT_VAL="${DB_PORT:-5432}"

# URL encode only if needed (contains special characters)
DB_USER_ENCODED=$(encode_url_if_needed "$DB_USER_VAL")
DB_PASSWORD_ENCODED=$(encode_url_if_needed "$DB_PASSWORD_VAL")
DB_NAME_ENCODED=$(encode_url_if_needed "$DB_NAME_VAL")

export DATABASE_URL="postgresql://${DB_USER_ENCODED}:${DB_PASSWORD_ENCODED}@${DB_HOST_VAL}:${DB_PORT_VAL}/${DB_NAME_ENCODED}?schema=public"

# Debug output (without password)
echo "Connecting to database: postgresql://${DB_USER_ENCODED}:***@${DB_HOST_VAL}:${DB_PORT_VAL}/${DB_NAME_ENCODED}?schema=public"

# Execute the command
exec "$@"

