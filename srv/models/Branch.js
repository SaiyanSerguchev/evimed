const prisma = require('../lib/prisma');

class Branch {
  static async getAll() {
    return await prisma.branch.findMany({
      orderBy: { order: 'asc' }
    });
  }

  static async getAllForAdmin() {
    return await prisma.branch.findMany({
      orderBy: { order: 'asc' }
    });
  }

  static async findById(id) {
    return await prisma.branch.findUnique({
      where: { id: parseInt(id) }
    });
  }

  static async create(branchData) {
    const { title, address, phone, email, workingHours, order } = branchData;
    return await prisma.branch.create({
      data: {
        title,
        address,
        phone,
        email,
        workingHours,
        order: parseInt(order) || 0
      }
    });
  }

  static async update(id, updateData) {
    const data = { ...updateData };
    if (data.order !== undefined) data.order = parseInt(data.order);

    return await prisma.branch.update({
      where: { id: parseInt(id) },
      data: data
    });
  }

  static async delete(id) {
    return await prisma.branch.delete({
      where: { id: parseInt(id) }
    });
  }

  static async getStats() {
    const total = await prisma.branch.count();

    return {
      total,
      active: total
    };
  }
}

module.exports = Branch;
