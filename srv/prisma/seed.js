const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
  const admin = await prisma.user.upsert({
    where: { login: process.env.ADMIN_LOGIN || 'admin' },
    update: {},
    create: {
      name: process.env.ADMIN_NAME || 'Администратор',
      login: process.env.ADMIN_LOGIN || 'admin',
      passwordHash: adminPassword,
      role: 'admin'
    }
  });

  console.log('✅ Admin user created:', admin.login);
  console.log('🔑 Admin credentials:');
  console.log(`   Login: ${admin.login}`);
  console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
  console.log(`   Name: ${admin.name}`);

  // Create service categories
  const categories = [
    {
      name: 'Двухмерные рентгенологические исследования',
      description: 'Классические рентгенологические исследования в 2D формате',
      order: 1
    },
    {
      name: 'Трехмерные рентгенологические исследования челюстей (КЛКТ)',
      description: 'Современные 3D исследования челюстно-лицевой области',
      order: 2
    },
    {
      name: 'ЛОР-исследования',
      description: 'Исследования для оториноларингологов',
      order: 3
    },
    {
      name: 'Дополнительные услуги',
      description: 'Дополнительные диагностические услуги',
      order: 4
    },
    {
      name: 'Пакетные предложения',
      description: 'Комплексные пакеты услуг',
      order: 5
    },
    {
      name: 'Распечатка и дублирование',
      description: 'Услуги по распечатке и дублированию снимков',
      order: 6
    }
  ];

  const createdCategories = [];
  for (const categoryData of categories) {
    try {
      const category = await prisma.serviceCategory.upsert({
        where: { name: categoryData.name },
        update: {},
        create: categoryData
      });
      createdCategories.push(category);
      console.log('✅ Service category created:', category.name);
    } catch (error) {
      console.log('⚠️ Service category already exists:', categoryData.name);
    }
  }

  // Create sample services for КЛКТ category
  const ctCategory = createdCategories.find(c => c.name === 'Трехмерные рентгенологические исследования челюстей (КЛКТ)');
  if (ctCategory) {
    const ctServices = [
      {
        name: '5×5 см, KaVo / область одного сегмента (4-6 зубов)',
        description: '3D-снимок отображает реальные размеры и пропорции анатомических структур',
        price: 1200.00,
        duration: '15–30 мин',
        preparation: 'Без подготовки',
        categoryId: ctCategory.id,
        order: 1
      },
      {
        name: '6×8 см, KaVo / область зубных дуг (запись на CD)',
        description: '3D-снимок отображает реальные размеры и пропорции анатомических структур',
        price: 1700.00,
        duration: '1-2 часа',
        preparation: 'Требуется подготовка',
        categoryId: ctCategory.id,
        order: 2
      },
      {
        name: '8×8 см, KaVo / область зубных дуг, нижнечелюстной канал (запись на CD)',
        description: '3D-снимок отображает реальные размеры и пропорции анатомических структур без искажений и со всех сторон. Это позволяет максимально детально изучить диагностическую картину и корректно спланировать лечение.',
        price: 2400.00,
        duration: '15 мин',
        preparation: 'Без подготовки',
        categoryId: ctCategory.id,
        order: 3
      },
      {
        name: '8×15 см, KaVo / зубные дуги, нижнечелюстной канал, дно верхнечелюстной пазухи',
        description: '3D-снимок отображает реальные размеры и пропорции анатомических структур',
        price: 3300.00,
        duration: '30 мин',
        preparation: 'Требуется подготовка',
        categoryId: ctCategory.id,
        order: 4
      },
      {
        name: '13×15 см, KaVo / полная челюстно-лицевая область, ВНЧС (CD-запись)',
        description: '3D-снимок отображает реальные размеры и пропорции анатомических структур без искажений и со всех сторон. Это позволяет максимально детально изучить диагностическую картину и корректно спланировать лечение.',
        price: 3500.00,
        duration: '1 час',
        preparation: 'Без подготовки',
        categoryId: ctCategory.id,
        order: 5
      }
    ];

    for (const serviceData of ctServices) {
      try {
        const service = await prisma.service.create({
          data: serviceData
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

  // Create sample advantages
  const advantages = [
    {
      title: 'Диагностика без очередей',
      description: 'Прием ведется только по предварительной записи. Сам визит займет у вас от 15 минут. Снимки вы получите сразу же после приема.',
      order: 1
    },
    {
      title: '270+ центров диагностики в России',
      description: 'Широкая сеть наших центров диагностики охватывает всю страну и постоянно растёт. Мы стараемся быть ближе к вам.',
      order: 2
    },
    {
      title: 'Преимущества диагностики',
      description: 'В наших центрах вы получите максимально точный и подробный результат исследований. Мы экономим ваше время и деньги.',
      order: 3
    },
    {
      title: 'Высоко-технологичное оборудование',
      description: 'Проводим исследования областей размером от 2-3 зубов до всей головы на самом современном оборудовании',
      order: 4
    }
  ];

  for (const advantageData of advantages) {
    try {
      const advantage = await prisma.advantage.upsert({
        where: { order: advantageData.order },
        update: {},
        create: advantageData
      });
          console.log('✅ Advantage created:', advantage.title);
        } catch (error) {
          console.log('⚠️ Advantage already exists:', advantageData.title);
        }
      }

      // Create sample branches
      const branches = [
        {
          title: 'Головной центр рентгено-диагностики',
          address: 'Якутск, пр. Ленина 1, этаж 7, офис 721',
          phone: '+7 (4112) 25-05-09',
          email: 'info@axiomaykt.ru',
          workingHours: 'Пн-Пт: 9:00-18:00, Сб: 9:00-15:00',
          order: 1
        },
        {
          title: 'Филиал на Кирова',
          address: 'Якутск, пр. Кирова 28, этаж 1, офис 101',
          phone: '+7 (495) 492-43-41',
          email: 'kirova@axiomaykt.ru',
          workingHours: 'Пн-Пт: 8:00-20:00, Сб-Вс: 9:00-17:00',
          order: 2
        },
        {
          title: 'Филиал на Автодорожной',
          address: 'Якутск, ул. Автодорожная 15, этаж 2, офис 201',
          phone: '+7 (495) 492-43-42',
          email: 'avtodor@axiomaykt.ru',
          workingHours: 'Пн-Пт: 9:00-19:00, Сб: 10:00-16:00',
          order: 3
        },
        {
          title: 'Филиал на Промышленной',
          address: 'Якутск, ул. Промышленная 8, этаж 3, офис 301',
          phone: '+7 (495) 492-43-43',
          email: 'prom@axiomaykt.ru',
          workingHours: 'Пн-Пт: 8:30-18:30, Сб: 9:00-14:00',
          order: 4
        }
      ];

      for (const branchData of branches) {
        try {
          const branch = await prisma.branch.create({
            data: branchData
          });
          console.log('✅ Branch created:', branch.title);
        } catch (error) {
          console.log('⚠️ Branch already exists:', branchData.title);
        }
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
