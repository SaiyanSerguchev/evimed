const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class Advantage {
  static async create(advantageData) {
    const { title, description, order } = advantageData;
    
    if (!title || !description || !order) {
      throw new Error('Title, description and order are required');
    }

    if (order < 1 || order > 4) {
      throw new Error('Order must be between 1 and 4');
    }

    return await prisma.advantage.create({
      data: {
        title,
        description,
        order: parseInt(order),
        isActive: true
      },
      select: {
        id: true,
        title: true,
        description: true,
        order: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  static async getById(id) {
    return await prisma.advantage.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        title: true,
        description: true,
        order: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  static async getByOrder(order) {
    return await prisma.advantage.findUnique({
      where: { order: parseInt(order) },
      select: {
        id: true,
        title: true,
        description: true,
        order: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  static async update(id, updateData) {
    const { title, description, order, isActive } = updateData;
    
    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (order !== undefined) {
      if (order < 1 || order > 4) {
        throw new Error('Order must be between 1 and 4');
      }
      data.order = parseInt(order);
    }
    if (isActive !== undefined) data.isActive = isActive;

    return await prisma.advantage.update({
      where: { id: parseInt(id) },
      data,
      select: {
        id: true,
        title: true,
        description: true,
        order: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  static async delete(id) {
    return await prisma.advantage.delete({
      where: { id: parseInt(id) }
    });
  }

  static async getAll() {
    return await prisma.advantage.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
  }

  static async getAllForAdmin() {
    return await prisma.advantage.findMany({
      orderBy: { order: 'asc' }
    });
  }

  static async toggleActive(id) {
    const advantage = await prisma.advantage.findUnique({
      where: { id: parseInt(id) }
    });

    if (!advantage) {
      throw new Error('Advantage not found');
    }

    return await prisma.advantage.update({
      where: { id: parseInt(id) },
      data: { isActive: !advantage.isActive },
      select: {
        id: true,
        title: true,
        description: true,
        order: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  static async swapOrders(id1, id2) {
    const advantage1 = await prisma.advantage.findUnique({
      where: { id: parseInt(id1) }
    });
    const advantage2 = await prisma.advantage.findUnique({
      where: { id: parseInt(id2) }
    });

    if (!advantage1 || !advantage2) {
      throw new Error('One or both advantages not found');
    }

    // Swap orders
    await prisma.advantage.update({
      where: { id: parseInt(id1) },
      data: { order: advantage2.order }
    });

    await prisma.advantage.update({
      where: { id: parseInt(id2) },
      data: { order: advantage1.order }
    });

    return await this.getAllForAdmin();
  }
}

module.exports = Advantage;
