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
    return await prisma.service.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
      select: { id: true }
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
}

module.exports = Service;