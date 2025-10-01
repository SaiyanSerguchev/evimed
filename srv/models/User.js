const prisma = require('../lib/prisma');

class User {
  static async create(userData) {
    const { name, email, phone, password, role = 'user' } = userData;
    
    return await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash: password,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });
  }

  static async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  static async findById(id) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });
  }

  static async update(id, updateData) {
    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        updatedAt: true
      }
    });
  }

  static async delete(id) {
    return await prisma.user.delete({
      where: { id: parseInt(id) },
      select: { id: true }
    });
  }

  static async getAll(options = {}) {
    const { page = 1, limit = 10, search = '' } = options;
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = User;