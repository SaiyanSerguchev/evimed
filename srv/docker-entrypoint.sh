#!/bin/sh
set -e

# URL encode function using node (more reliable)
encode_url() {
  node -e "console.log(encodeURIComponent(process.argv[1]))" "$1"
}

# Build DATABASE_URL from components with proper URL encoding
DB_USER_VAL="${DB_USER:-postgres}"
DB_PASSWORD_VAL="${DB_PASSWORD:-postgres}"
DB_NAME_VAL="${DB_NAME:-evimed}"
DB_HOST_VAL="${DB_HOST:-postgres}"
DB_PORT_VAL="${DB_PORT:-5432}"

# URL encode components that may contain special characters
DB_USER_ENCODED=$(encode_url "$DB_USER_VAL")
DB_PASSWORD_ENCODED=$(encode_url "$DB_PASSWORD_VAL")
DB_NAME_ENCODED=$(encode_url "$DB_NAME_VAL")

export DATABASE_URL="postgresql://${DB_USER_ENCODED}:${DB_PASSWORD_ENCODED}@${DB_HOST_VAL}:${DB_PORT_VAL}/${DB_NAME_ENCODED}?schema=public"

# Execute the command
exec "$@"

