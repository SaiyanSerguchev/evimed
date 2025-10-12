const prisma = require('../lib/prisma');

class Banner {
  static async getAll() {
    return await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
  }

  static async findById(id) {
    return await prisma.banner.findFirst({
      where: { 
        id: parseInt(id),
        isActive: true 
      }
    });
  }

  static async create(bannerData) {
    const { title, description, buttonText, buttonUrl, imageUrl, imageAlt, order } = bannerData;
    
    return await prisma.banner.create({
      data: {
        title,
        description,
        buttonText,
        buttonUrl,
        imageUrl,
        imageAlt,
        order: order || 0
      }
    });
  }

  static async update(id, updateData) {
    return await prisma.banner.update({
      where: { id: parseInt(id) },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });
  }

  static async delete(id) {
    return await prisma.banner.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
      select: { id: true }
    });
  }

  static async getAllForAdmin() {
    return await prisma.banner.findMany({
      orderBy: { order: 'asc' }
    });
  }

  static async updateOrder(banners) {
    const updatePromises = banners.map((banner, index) => 
      prisma.banner.update({
        where: { id: banner.id },
        data: { order: index }
      })
    );
    
    return await Promise.all(updatePromises);
  }
}

module.exports = Banner;

