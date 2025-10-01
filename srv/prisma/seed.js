const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@evimed.ru' },
    update: {},
    create: {
      name: 'Администратор',
      email: 'admin@evimed.ru',
      phone: '+7 (999) 123-45-67',
      passwordHash: adminPassword,
      role: 'admin'
    }
  });

  console.log('✅ Admin user created:', admin.email);

  // Create sample services
  const services = [
    {
      name: 'Рентген грудной клетки',
      description: 'Рентгенологическое исследование органов грудной клетки',
      price: 1500.00,
      duration: 30,
      category: 'Рентген'
    },
    {
      name: 'Рентген позвоночника',
      description: 'Рентгенологическое исследование позвоночного столба',
      price: 2000.00,
      duration: 45,
      category: 'Рентген'
    },
    {
      name: 'Рентген суставов',
      description: 'Рентгенологическое исследование суставов',
      price: 1800.00,
      duration: 30,
      category: 'Рентген'
    },
    {
      name: 'КТ головы',
      description: 'Компьютерная томография головного мозга',
      price: 3500.00,
      duration: 60,
      category: 'КТ'
    },
    {
      name: 'МРТ позвоночника',
      description: 'Магнитно-резонансная томография позвоночника',
      price: 4500.00,
      duration: 90,
      category: 'МРТ'
    },
    {
      name: 'УЗИ брюшной полости',
      description: 'Ультразвуковое исследование органов брюшной полости',
      price: 2200.00,
      duration: 45,
      category: 'УЗИ'
    }
  ];

  for (const serviceData of services) {
    const service = await prisma.service.upsert({
      where: { name: serviceData.name },
      update: {},
      create: serviceData
    });
    console.log('✅ Service created:', service.name);
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
