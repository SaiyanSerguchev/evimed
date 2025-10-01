const prisma = require('../lib/prisma');

class Service {
  static async getAll() {
    return await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
  }

  static async findById(id) {
    return await prisma.service.findFirst({
      where: { 
        id: parseInt(id),
        isActive: true 
      }
    });
  }

  static async create(serviceData) {
    const { name, description, price, duration, category } = serviceData;
    
    return await prisma.service.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
        category
      }
    });
  }

  static async update(id, updateData) {
    const data = { ...updateData };
    
    if (data.price) data.price = parseFloat(data.price);
    if (data.duration) data.duration = parseInt(data.duration);
    
    return await prisma.service.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        updatedAt: new Date()
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

  static async getStats() {
    const total = await prisma.service.count({
      where: { isActive: true }
    });

    const byCategory = await prisma.service.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: { category: true }
    });

    return {
      total,
      byCategory: byCategory.map(item => ({
        category: item.category || 'Без категории',
        count: item._count.category
      }))
    };
  }
}

module.exports = Service;