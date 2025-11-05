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
        },
        parent: true,
        children: {
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
        },
        parent: true,
        children: {
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
        },
        parent: true,
        children: {
          orderBy: { order: 'asc' }
        }
      }
    });
  }

  static async create(categoryData) {
    const { name, description, order, parentId } = categoryData;
    return await prisma.serviceCategory.create({
      data: {
        name,
        description,
        order: parseInt(order) || 0,
        parentId: parentId ? parseInt(parentId) : null
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
    // Hard delete - удаляем из БД
    return await prisma.serviceCategory.delete({
      where: { id: parseInt(id) }
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

  static async upsertByRenovatioId(renovatioId, data) {
    return await prisma.serviceCategory.upsert({
      where: { renovatioId },
      update: data,
      create: { ...data, renovatioId }
    });
  }

  static async findByRenovatioId(renovatioId) {
    return await prisma.serviceCategory.findFirst({
      where: { renovatioId }
    });
  }

  static async getAllRenovatioCategories() {
    return await prisma.serviceCategory.findMany({
      where: { 
        renovatioId: { not: null },
        isActive: true 
      },
      orderBy: { order: 'asc' }
    });
  }

  static async syncFromRenovatio(renovatioCategories) {
    const results = {
      created: 0,
      updated: 0,
      errors: []
    };

    // ПРОХОД 1: Создать/обновить все категории БЕЗ parentId
    for (const category of renovatioCategories) {
      try {
        const categoryData = {
          name: category.title,
          description: null,
          order: category.order || 0,
          renovatioParentId: category.parent_id || null
        };

        const existingCategory = await prisma.serviceCategory.findFirst({
          where: { renovatioId: category.id }
        });

        if (existingCategory) {
          await prisma.serviceCategory.update({
            where: { id: existingCategory.id },
            data: categoryData
          });
          results.updated++;
        } else {
          await prisma.serviceCategory.create({
            data: { ...categoryData, renovatioId: category.id }
          });
          results.created++;
        }
      } catch (error) {
        results.errors.push({
          renovatioId: category.id,
          name: category.title,
          error: error.message
        });
      }
    }

    // ПРОХОД 2: Установить parentId на основе renovatioParentId
    try {
      // Получаем все категории с их renovatio ID
      const allCategories = await prisma.serviceCategory.findMany({
        where: { renovatioId: { not: null } },
        select: { id: true, renovatioId: true, renovatioParentId: true }
      });

      // Создаем маппинг renovatioId -> localId
      const renovatioToLocalMap = {};
      allCategories.forEach(cat => {
        renovatioToLocalMap[cat.renovatioId] = cat.id;
      });

      // Обновляем parentId для категорий с родителями
      for (const cat of allCategories) {
        if (cat.renovatioParentId && renovatioToLocalMap[cat.renovatioParentId]) {
          await prisma.serviceCategory.update({
            where: { id: cat.id },
            data: { parentId: renovatioToLocalMap[cat.renovatioParentId] }
          });
        } else if (cat.renovatioParentId === null) {
          // Очищаем parentId если нет родителя в Renovatio
          await prisma.serviceCategory.update({
            where: { id: cat.id },
            data: { parentId: null }
          });
        }
      }
    } catch (error) {
      results.errors.push({
        phase: 'hierarchy_linking',
        error: error.message
      });
    }

    return results;
  }
}

module.exports = ServiceCategory;
