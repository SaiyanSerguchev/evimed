const prisma = require('../lib/prisma');

class ServiceCategory {
  static async getAll() {
    return await prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        services: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      }
    });
  }

  static async getAllForAdmin() {
    return await prisma.serviceCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        services: {
          orderBy: { order: 'asc' }
        }
      }
    });
  }

  static async findById(id) {
    return await prisma.serviceCategory.findUnique({
      where: { id: parseInt(id) },
      include: {
        services: {
          orderBy: { order: 'asc' }
        }
      }
    });
  }

  static async create(categoryData) {
    const { name, description, order } = categoryData;
    return await prisma.serviceCategory.create({
      data: {
        name,
        description,
        order: parseInt(order) || 0
      }
    });
  }

  static async update(id, updateData) {
    const data = { ...updateData };
    if (data.order !== undefined) data.order = parseInt(data.order);
    
    return await prisma.serviceCategory.update({
      where: { id: parseInt(id) },
      data: data
    });
  }

  static async delete(id) {
    return await prisma.serviceCategory.update({
      where: { id: parseInt(id) },
      data: { isActive: false }
    });
  }

  static async getStats() {
    const total = await prisma.serviceCategory.count({
      where: { isActive: true }
    });

    const withServices = await prisma.serviceCategory.count({
      where: { 
        isActive: true,
        services: {
          some: { isActive: true }
        }
      }
    });

    return {
      total,
      withServices,
      empty: total - withServices
    };
  }

  static async upsertByRenovatioId(renovatioId, data) {
    return await prisma.serviceCategory.upsert({
      where: { renovatioId },
      update: data,
      create: { ...data, renovatioId }
    });
  }

  static async findByRenovatioId(renovatioId) {
    return await prisma.serviceCategory.findFirst({
      where: { renovatioId }
    });
  }

  static async getAllRenovatioCategories() {
    return await prisma.serviceCategory.findMany({
      where: { 
        renovatioId: { not: null },
        isActive: true 
      },
      orderBy: { order: 'asc' }
    });
  }

  static async syncFromRenovatio(renovatioCategories) {
    const results = {
      created: 0,
      updated: 0,
      errors: []
    };

    for (const category of renovatioCategories) {
      try {
        const categoryData = {
          name: category.title,
          description: null,
          order: 0
        };

        const existingCategory = await prisma.serviceCategory.findFirst({
          where: { renovatioId: category.id }
        });

        if (existingCategory) {
          await prisma.serviceCategory.update({
            where: { id: existingCategory.id },
            data: categoryData
          });
          results.updated++;
        } else {
          await prisma.serviceCategory.create({
            data: { ...categoryData, renovatioId: category.id }
          });
          results.created++;
        }
      } catch (error) {
        results.errors.push({
          renovatioId: category.id,
          error: error.message
        });
      }
    }

    return results;
  }
}

module.exports = ServiceCategory;
