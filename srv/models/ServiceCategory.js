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
}

module.exports = ServiceCategory;
