const emailService = require('./emailService');

class VerificationService {
  constructor() {
    this.codeLength = parseInt(process.env.VERIFICATION_CODE_LENGTH) || 4;
    this.expiryMinutes = parseInt(process.env.VERIFICATION_CODE_EXPIRY_MINUTES) || 10;
    this.maxAttempts = parseInt(process.env.VERIFICATION_MAX_ATTEMPTS) || 3;
  }

  generateCode() {
    const min = Math.pow(10, this.codeLength - 1);
    const max = Math.pow(10, this.codeLength) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getExpiryTime() {
    const now = new Date();
    return new Date(now.getTime() + this.expiryMinutes * 60 * 1000);
  }

  async createVerification(email) {
    const prisma = require('../lib/prisma');
    
    // Проверяем, есть ли уже активный код для этого email
    const existingCode = await prisma.verificationCode.findFirst({
      where: {
        email: email,
        isVerified: false,
        isUsed: false,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (existingCode) {
      // Если код еще не истек, возвращаем существующий
      const timeLeft = Math.floor((existingCode.expiresAt.getTime() - new Date().getTime()) / 1000);
      if (timeLeft > 0) {
        return {
          success: false,
          message: 'Код уже отправлен. Попробуйте позже.',
          timeLeft: timeLeft,
          canResend: false
        };
      }
    }

    // Генерируем новый код
    const code = this.generateCode();
    const expiresAt = this.getExpiryTime();

    try {
      // Отправляем email с кодом
      await emailService.sendVerificationCode(email, code);

      // Сохраняем код в БД
      const verificationCode = await prisma.verificationCode.create({
        data: {
          email: email,
          code: code.toString(),
          expiresAt: expiresAt,
          attempts: 0,
          isVerified: false,
          isUsed: false
        }
      });

      return {
        success: true,
        message: 'Код отправлен на email',
        verificationId: verificationCode.id,
        expiresAt: expiresAt,
        timeLeft: this.expiryMinutes * 60
      };
    } catch (error) {
      console.error('Error creating verification:', error);
      return {
        success: false,
        message: 'Ошибка отправки кода. Попробуйте позже.',
        error: error.message
      };
    }
  }

  async verifyCode(email, code) {
    const prisma = require('../lib/prisma');

    try {
      // Находим активный код
      const verificationCode = await prisma.verificationCode.findFirst({
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

      if (!verificationCode) {
        return {
          success: false,
          message: 'Код не найден или истек. Запросите новый код.',
          code: 'CODE_NOT_FOUND'
        };
      }

      // Проверяем количество попыток
      if (verificationCode.attempts >= this.maxAttempts) {
        return {
          success: false,
          message: 'Превышено максимальное количество попыток. Запросите новый код.',
          code: 'MAX_ATTEMPTS_EXCEEDED'
        };
      }

      // Проверяем код
      if (verificationCode.code !== code.toString()) {
        // Увеличиваем счетчик попыток
        await prisma.verificationCode.update({
          where: { id: verificationCode.id },
          data: { attempts: verificationCode.attempts + 1 }
        });

        const remainingAttempts = this.maxAttempts - verificationCode.attempts - 1;
        
        return {
          success: false,
          message: `Неверный код. Осталось попыток: ${remainingAttempts}`,
          code: 'INVALID_CODE',
          remainingAttempts: remainingAttempts
        };
      }

      // Код верный - помечаем как верифицированный
      await prisma.verificationCode.update({
        where: { id: verificationCode.id },
        data: { 
          isVerified: true,
          isUsed: true
        }
      });

      return {
        success: true,
        message: 'Email успешно подтвержден',
        verificationId: verificationCode.id
      };
    } catch (error) {
      console.error('Error verifying code:', error);
      return {
        success: false,
        message: 'Ошибка проверки кода. Попробуйте позже.',
        error: error.message
      };
    }
  }

  async getVerificationStatus(email) {
    const prisma = require('../lib/prisma');

    try {
      const verificationCode = await prisma.verificationCode.findFirst({
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

      if (!verificationCode) {
        return {
          hasActiveCode: false,
          message: 'Нет активного кода'
        };
      }

      const timeLeft = Math.floor((verificationCode.expiresAt.getTime() - new Date().getTime()) / 1000);
      const remainingAttempts = this.maxAttempts - verificationCode.attempts;

      return {
        hasActiveCode: true,
        timeLeft: timeLeft,
        remainingAttempts: remainingAttempts,
        attempts: verificationCode.attempts,
        expiresAt: verificationCode.expiresAt,
        canResend: timeLeft < 60 // Можно переотправить если осталось меньше минуты
      };
    } catch (error) {
      console.error('Error getting verification status:', error);
      return {
        hasActiveCode: false,
        message: 'Ошибка получения статуса',
        error: error.message
      };
    }
  }

  async resendCode(email) {
    const prisma = require('../lib/prisma');

    try {
      // Проверяем статус текущего кода
      const status = await this.getVerificationStatus(email);
      
      if (status.hasActiveCode && !status.canResend) {
        return {
          success: false,
          message: 'Код уже отправлен. Попробуйте позже.',
          timeLeft: status.timeLeft
        };
      }

      // Удаляем старые коды для этого email
      await prisma.verificationCode.updateMany({
        where: {
          email: email,
          isVerified: false,
          isUsed: false
        },
        data: {
          isUsed: true
        }
      });

      // Создаем новый код
      return await this.createVerification(email);
    } catch (error) {
      console.error('Error resending code:', error);
      return {
        success: false,
        message: 'Ошибка повторной отправки кода',
        error: error.message
      };
    }
  }

  async cleanupExpiredCodes() {
    const prisma = require('../lib/prisma');

    try {
      const result = await prisma.verificationCode.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      });

      console.log(`Cleaned up ${result.count} expired verification codes`);
      return result.count;
    } catch (error) {
      console.error('Error cleaning up expired codes:', error);
      return 0;
    }
  }

  async cleanupExpiredRequests() {
    const prisma = require('../lib/prisma');

    try {
      const result = await prisma.appointmentRequest.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          },
          isVerified: false
        }
      });

      console.log(`Cleaned up ${result.count} expired appointment requests`);
      return result.count;
    } catch (error) {
      console.error('Error cleaning up expired requests:', error);
      return 0;
    }
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  formatEmail(email) {
    return email.toLowerCase().trim();
  }
}

module.exports = new VerificationService();
