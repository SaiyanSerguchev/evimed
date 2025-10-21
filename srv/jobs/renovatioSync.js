const cron = require('node-cron');
const renovatioService = require('../services/renovatioService');
const verificationService = require('../services/verificationService');
const Service = require('../models/Service');
const ServiceCategory = require('../models/ServiceCategory');

class RenovatioSyncJob {
  constructor() {
    this.isEnabled = process.env.RENOVATIO_SYNC_ENABLED === 'true';
    this.cronSchedule = process.env.RENOVATIO_SYNC_CRON || '0 */6 * * *'; // каждые 6 часов
    this.cleanupSchedule = '*/15 * * * *'; // каждые 15 минут
    this.syncTask = null;
    this.cleanupTask = null;
  }

  start() {
    console.log(`Starting Renovatio sync job with schedule: ${this.cronSchedule}`);
    
    if (this.isEnabled) {
      this.syncTask = cron.schedule(this.cronSchedule, async () => {
        await this.syncServices();
      }, {
        scheduled: true,
        timezone: 'Europe/Moscow'
      });
      console.log('Renovatio sync job started');
    } else {
      console.log('Renovatio sync job is disabled');
    }

    // Запускаем задачу очистки независимо от статуса синхронизации
    console.log(`Starting cleanup job with schedule: ${this.cleanupSchedule}`);
    this.cleanupTask = cron.schedule(this.cleanupSchedule, async () => {
      await this.runCleanup();
    }, {
      scheduled: true,
      timezone: 'Europe/Moscow'
    });
    console.log('Cleanup job started');
  }

  stop() {
    if (this.syncTask) {
      this.syncTask.stop();
      console.log('Renovatio sync job stopped');
    }
    if (this.cleanupTask) {
      this.cleanupTask.stop();
      console.log('Cleanup job stopped');
    }
  }

  async syncServices() {
    try {
      console.log('Starting automatic Renovatio sync...');
      
      // Получаем данные из Renovatio
      const [renovatioCategories, renovatioServices] = await Promise.all([
        renovatioService.getServiceCategories(),
        renovatioService.getServices()
      ]);

      console.log(`Received ${renovatioCategories.length} categories and ${renovatioServices.length} services from Renovatio`);

      // Синхронизируем категории
      const categoryResults = await ServiceCategory.syncFromRenovatio(renovatioCategories);
      console.log('Categories sync results:', categoryResults);

      // Синхронизируем услуги
      const serviceResults = await Service.syncFromRenovatio(renovatioServices);
      console.log('Services sync results:', serviceResults);

      console.log('Automatic Renovatio sync completed successfully');
      
      return {
        success: true,
        categories: categoryResults,
        services: serviceResults,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Automatic Renovatio sync failed:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Ручной запуск синхронизации
  async manualSync() {
    console.log('Starting manual Renovatio sync...');
    return await this.syncServices();
  }

  // Очистка просроченных данных
  async runCleanup() {
    try {
      console.log('Starting cleanup of expired verification data...');
      
      const expiredCodes = await verificationService.cleanupExpiredCodes();
      const expiredRequests = await verificationService.cleanupExpiredRequests();
      
      console.log(`Cleanup completed: ${expiredCodes} expired codes, ${expiredRequests} expired requests`);
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  // Получение статуса задачи
  getStatus() {
    return {
      syncEnabled: this.isEnabled,
      syncScheduled: !!this.syncTask,
      cleanupScheduled: !!this.cleanupTask,
      syncCronSchedule: this.cronSchedule,
      cleanupCronSchedule: this.cleanupSchedule
    };
  }
}

module.exports = new RenovatioSyncJob();
