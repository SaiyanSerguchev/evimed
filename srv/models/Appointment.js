const prisma = require('../lib/prisma');

class Appointment {
  static async create(appointmentData) {
    const { user_id, service_id, appointment_date, appointment_time, notes } = appointmentData;
    
    return await prisma.appointment.create({
      data: {
        userId: parseInt(user_id),
        serviceId: parseInt(service_id),
        appointmentDate: new Date(appointment_date),
        appointmentTime: appointment_time,
        notes
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true
          }
        }
      }
    });
  }

  static async findByUserId(userId) {
    return await prisma.appointment.findMany({
      where: { userId: parseInt(userId) },
      include: {
        service: {
          select: {
            name: true,
            price: true
          }
        }
      },
      orderBy: [
        { appointmentDate: 'desc' },
        { appointmentTime: 'desc' }
      ]
    });
  }

  static async findById(id) {
    return await prisma.appointment.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true
          }
        }
      }
    });
  }

  static async updateStatus(id, status) {
    return await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { 
        status,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true
          }
        }
      }
    });
  }

  static async getByDateRange(startDate, endDate) {
    return await prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        service: {
          select: {
            name: true
          }
        }
      },
      orderBy: [
        { appointmentDate: 'asc' },
        { appointmentTime: 'asc' }
      ]
    });
  }

  static async getAll(options = {}) {
    const { page = 1, limit = 10, status, date_from, date_to } = options;
    const skip = (page - 1) * limit;

    const where = {};
    
    if (status) where.status = status;
    if (date_from || date_to) {
      where.appointmentDate = {};
      if (date_from) where.appointmentDate.gte = new Date(date_from);
      if (date_to) where.appointmentDate.lte = new Date(date_to);
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          service: {
            select: {
              id: true,
              name: true,
              price: true
            }
          }
        },
        orderBy: [
          { appointmentDate: 'desc' },
          { appointmentTime: 'desc' }
        ]
      }),
      prisma.appointment.count({ where })
    ]);

    return {
      appointments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async getStats(period = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    const [total, today, byStatus, byService] = await Promise.all([
      prisma.appointment.count(),
      prisma.appointment.count({
        where: {
          appointmentDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      }),
      prisma.appointment.groupBy({
        by: ['status'],
        where: {
          createdAt: { gte: startDate }
        },
        _count: { status: true }
      }),
      prisma.appointment.groupBy({
        by: ['serviceId'],
        where: {
          createdAt: { gte: startDate }
        },
        _count: { serviceId: true },
        _max: { createdAt: true }
      })
    ]);

    // Get service names for the stats
    const serviceIds = byService.map(item => item.serviceId);
    const services = await prisma.service.findMany({
      where: { id: { in: serviceIds } },
      select: { id: true, name: true }
    });

    const byServiceWithNames = byService.map(item => {
      const service = services.find(s => s.id === item.serviceId);
      return {
        serviceName: service?.name || 'Unknown',
        count: item._count.serviceId
      };
    });

    return {
      total,
      today,
      byStatus: byStatus.map(item => ({
        status: item.status,
        count: item._count.status
      })),
      byService: byServiceWithNames
    };
  }
}

module.exports = Appointment;