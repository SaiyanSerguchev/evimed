const prisma = require('../lib/prisma');

class Service {
  static async getAll() {
    return await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        category: true
      }
    });
  }

  static async getByCategory(categoryId) {
    return await prisma.service.findMany({
      where: { 
        categoryId: parseInt(categoryId),
        isActive: true 
      },
      orderBy: { order: 'asc' },
      include: {
        category: true
      }
    });
  }

  static async findById(id) {
    return await prisma.service.findFirst({
      where: { 
        id: parseInt(id),
        isActive: true 
      },
      include: {
        category: true
      }
    });
  }

  static async create(serviceData) {
    const { name, description, price, duration, preparation, categoryId, order } = serviceData;
    
    return await prisma.service.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        duration,
        preparation,
        categoryId: parseInt(categoryId),
        order: parseInt(order) || 0
      },
      include: {
        category: true
      }
    });
  }

  static async update(id, updateData) {
    const data = { ...updateData };
    
    if (data.price) data.price = parseFloat(data.price);
    if (data.categoryId) data.categoryId = parseInt(data.categoryId);
    if (data.order !== undefined) data.order = parseInt(data.order);
    
    return await prisma.service.update({
      where: { id: parseInt(id) },
      data: data,
      include: {
        category: true
      }
    });
  }

  static async delete(id) {
    // Hard delete - удаляем из БД
    return await prisma.service.delete({
      where: { id: parseInt(id) }
    });
  }

  static async getAllForAdmin() {
    return await prisma.service.findMany({
      orderBy: { order: 'asc' },
      include: {
        category: true
      }
    });
  }

  static async getStats() {
    const total = await prisma.service.count({
      where: { isActive: true }
    });

    const byCategory = await prisma.service.groupBy({
      by: ['categoryId'],
      where: { isActive: true },
      _count: { categoryId: true }
    });

    // Get category names
    const categoryStats = await Promise.all(
      byCategory.map(async (item) => {
        const category = await prisma.serviceCategory.findUnique({
          where: { id: item.categoryId },
          select: { name: true }
        });
        return {
          category: category?.name || 'Неизвестная категория',
          count: item._count.categoryId
        };
      })
    );

    return {
      total,
      byCategory: categoryStats
    };
  }

  static async upsertByRenovatioId(renovatioId, data) {
    return await prisma.service.upsert({
      where: { renovatioId },
      update: data,
      create: { ...data, renovatioId },
      include: { category: true }
    });
  }

  static async findByRenovatioId(renovatioId) {
    return await prisma.service.findFirst({
      where: { renovatioId },
      include: { category: true }
    });
  }

  static async getAllRenovatioServices() {
    return await prisma.service.findMany({
      where: { 
        renovatioId: { not: null },
        isActive: true 
      },
      include: { category: true },
      orderBy: { order: 'asc' }
    });
  }

  static async syncFromRenovatio(renovatioServices) {
    const results = {
      created: 0,
      updated: 0,
      errors: []
    };

    for (const service of renovatioServices) {
      try {
        const serviceData = {
          name: service.title,
          description: service.full_desc || service.short_desc,
          price: parseFloat(service.price) || 0,
          duration: service.duration ? `${service.duration} мин` : null,
          preparation: service.preparation,
          renovatioCode: service.code,
          order: 0
        };

        // Найти категорию по renovatioId
        const category = await prisma.serviceCategory.findFirst({
          where: { renovatioId: service.category_id }
        });

        if (category) {
          serviceData.categoryId = category.id;
        }

        const existingService = await prisma.service.findFirst({
          where: { renovatioId: service.service_id }
        });

        if (existingService) {
          await prisma.service.update({
            where: { id: existingService.id },
            data: serviceData
          });
          results.updated++;
        } else {
          await prisma.service.create({
            data: { ...serviceData, renovatioId: service.service_id }
          });
          results.created++;
        }
      } catch (error) {
        results.errors.push({
          renovatioId: service.service_id,
          error: error.message
        });
      }
    }

    return results;
  }
}

module.exports = Service;