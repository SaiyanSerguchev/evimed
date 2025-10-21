const prisma = require('../lib/prisma');

class AppointmentRequest {
  static async create(data) {
    const {
      email,
      phone,
      firstName,
      lastName,
      thirdName,
      birthDate,
      gender,
      doctorId,
      clinicId,
      timeStart,
      timeEnd,
      serviceId,
      comment,
      channel,
      source,
      type,
      isOutside,
      isTelemedicine,
      verificationId
    } = data;

    // Устанавливаем время истечения (1 час с момента создания)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    return await prisma.appointmentRequest.create({
      data: {
        email: email,
        phone: phone,
        firstName: firstName,
        lastName: lastName,
        thirdName: thirdName,
        birthDate: birthDate,
        gender: gender,
        doctorId: parseInt(doctorId),
        clinicId: parseInt(clinicId),
        timeStart: timeStart,
        timeEnd: timeEnd,
        serviceId: serviceId ? parseInt(serviceId) : null,
        comment: comment,
        channel: channel,
        source: source,
        type: type,
        isOutside: isOutside || false,
        isTelemedicine: isTelemedicine || false,
        isVerified: false,
        verificationId: verificationId,
        expiresAt: expiresAt
      }
    });
  }

  static async findByEmail(email) {
    return await prisma.appointmentRequest.findFirst({
      where: {
        email: email,
        isVerified: false,
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
    return await prisma.appointmentRequest.findUnique({
      where: { id: parseInt(id) }
    });
  }

  static async findByVerificationId(verificationId) {
    return await prisma.appointmentRequest.findFirst({
      where: {
        verificationId: parseInt(verificationId),
        isVerified: false,
        expiresAt: {
          gt: new Date()
        }
      }
    });
  }

  static async markAsVerified(id) {
    return await prisma.appointmentRequest.update({
      where: { id: parseInt(id) },
      data: { 
        isVerified: true,
        updatedAt: new Date()
      }
    });
  }

  static async delete(id) {
    return await prisma.appointmentRequest.delete({
      where: { id: parseInt(id) }
    });
  }

  static async cleanupExpired() {
    return await prisma.appointmentRequest.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        },
        isVerified: false
      }
    });
  }

  static async getAllActive() {
    return await prisma.appointmentRequest.findMany({
      where: {
        isVerified: false,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async getAllVerified() {
    return await prisma.appointmentRequest.findMany({
      where: {
        isVerified: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async getStats() {
    const total = await prisma.appointmentRequest.count();
    const active = await prisma.appointmentRequest.count({
      where: {
        isVerified: false,
        expiresAt: {
          gt: new Date()
        }
      }
    });
    const verified = await prisma.appointmentRequest.count({
      where: { isVerified: true }
    });
    const expired = await prisma.appointmentRequest.count({
      where: {
        expiresAt: {
          lt: new Date()
        },
        isVerified: false
      }
    });

    return {
      total,
      active,
      verified,
      expired
    };
  }

  static async getByDateRange(startDate, endDate) {
    return await prisma.appointmentRequest.findMany({
      where: {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async getByDoctor(doctorId) {
    return await prisma.appointmentRequest.findMany({
      where: {
        doctorId: parseInt(doctorId),
        isVerified: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async getByClinic(clinicId) {
    return await prisma.appointmentRequest.findMany({
      where: {
        clinicId: parseInt(clinicId),
        isVerified: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}

module.exports = AppointmentRequest;
