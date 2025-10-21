const prisma = require('../lib/prisma');

class VerificationCode {
  static async create(email, code, expiresAt) {
    return await prisma.verificationCode.create({
      data: {
        email: email,
        code: code,
        expiresAt: expiresAt,
        attempts: 0,
        isVerified: false,
        isUsed: false
      }
    });
  }

  static async findByEmail(email) {
    return await prisma.verificationCode.findFirst({
      where: {
        email: email,
        isVerified: false,
        isUsed: false,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async findById(id) {
    return await prisma.verificationCode.findUnique({
      where: { id: parseInt(id) }
    });
  }

  static async verify(email, code) {
    const verificationCode = await this.findByEmail(email);
    
    if (!verificationCode) {
      return { success: false, message: 'Код не найден или истек' };
    }

    if (verificationCode.code !== code.toString()) {
      return { success: false, message: 'Неверный код' };
    }

    const updated = await prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { 
        isVerified: true,
        isUsed: true
      }
    });

    return { success: true, verificationCode: updated };
  }

  static async incrementAttempts(id) {
    return await prisma.verificationCode.update({
      where: { id: parseInt(id) },
      data: { 
        attempts: {
          increment: 1
        }
      }
    });
  }

  static async markAsUsed(id) {
    return await prisma.verificationCode.update({
      where: { id: parseInt(id) },
      data: { isUsed: true }
    });
  }

  static async markAsVerified(id) {
    return await prisma.verificationCode.update({
      where: { id: parseInt(id) },
      data: { 
        isVerified: true,
        isUsed: true
      }
    });
  }

  static async cleanupExpired() {
    return await prisma.verificationCode.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  }

  static async getAllActive() {
    return await prisma.verificationCode.findMany({
      where: {
        isVerified: false,
        isUsed: false,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async getStats() {
    const total = await prisma.verificationCode.count();
    const active = await prisma.verificationCode.count({
      where: {
        isVerified: false,
        isUsed: false,
        expiresAt: {
          gt: new Date()
        }
      }
    });
    const verified = await prisma.verificationCode.count({
      where: { isVerified: true }
    });
    const expired = await prisma.verificationCode.count({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });

    return {
      total,
      active,
      verified,
      expired
    };
  }
}

module.exports = VerificationCode;
