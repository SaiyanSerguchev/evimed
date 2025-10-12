const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@evimed.ru' },
    update: {},
    create: {
      name: process.env.ADMIN_NAME || 'Администратор',
      email: process.env.ADMIN_EMAIL || 'admin@evimed.ru',
      phone: process.env.ADMIN_PHONE || '+7 (999) 123-45-67',
      passwordHash: adminPassword,
      role: 'admin'
    }
  });

  console.log('✅ Admin user created:', admin.email);
  console.log('📧 Admin credentials:');
  console.log(`   Email: ${admin.email}`);
  console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
  console.log(`   Name: ${admin.name}`);
  console.log(`   Phone: ${admin.phone}`);

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
    try {
      const service = await prisma.service.upsert({
        where: { name: serviceData.name },
        update: {},
        create: serviceData
      });
      console.log('✅ Service created:', service.name);
    } catch (error) {
      // Если сервис уже существует, просто создаем новый
      const service = await prisma.service.create({
        data: serviceData
      });
      console.log('✅ Service created:', service.name);
    }
  }

  // Create sample banners
  const banners = [
    {
      title: 'Федеральная сеть независимых центров рентгенодиагностики «Эвимед»',
      description: 'Предоставляем услуги в области рентгенодиагностики для стоматологов, оториноларингологов и челюстно–лицевых хирургов.',
      buttonText: 'Записаться на прием',
      buttonUrl: '/appointment',
      imageUrl: null, // Будет использоваться дефолтное изображение
      imageAlt: 'Ортопантомограф OP300',
      order: 0
    },
    {
      title: 'Мы открыли уникальный центр функциональной диагностики!',
      description: 'Предоставляем услуги в области рентгенодиагностики для стоматологов, оториноларингологов и челюстно–лицевых хирургов.',
      buttonText: 'Записаться на прием',
      buttonUrl: '/appointment',
      imageUrl: null, // Будет использоваться дефолтное изображение
      imageAlt: 'Центр функциональной диагностики',
      order: 1
    }
  ];

  for (const bannerData of banners) {
    const banner = await prisma.banner.create({
      data: bannerData
    });
    console.log('✅ Banner created:', banner.title);
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
