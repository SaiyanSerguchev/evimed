const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    const emailService = process.env.EMAIL_SERVICE || 'gmail';
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const emailHost = process.env.EMAIL_HOST;
    const emailPort = process.env.EMAIL_PORT;
    const emailSecure = process.env.EMAIL_SECURE === 'true';

    if (!emailUser || !emailPass) {
      console.warn('Email configuration not found. Email service will not work.');
      return;
    }

    // Конфигурация для разных провайдеров
    let transporterConfig;
    
    if (emailService === 'yandex') {
      transporterConfig = {
        host: emailHost || 'smtp.yandex.ru',
        port: parseInt(emailPort) || 587,
        secure: emailSecure || false,
        auth: {
          user: emailUser,
          pass: emailPass
        },
        tls: {
          rejectUnauthorized: false
        }
      };
    } else {
      // Для Gmail и других сервисов
      transporterConfig = {
        service: emailService,
        auth: {
          user: emailUser,
          pass: emailPass
        }
      };
    }

    this.transporter = nodemailer.createTransporter(transporterConfig);

    // Verify connection configuration
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('Email service configuration error:', error);
      } else {
        console.log(`Email service (${emailService}) is ready to send messages`);
      }
    });
  }

  async sendEmail(to, subject, html, text = null) {
    if (!this.transporter) {
      throw new Error('Email service not configured');
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Evimed <noreply@evimed.ru>',
      to: to,
      subject: subject,
      html: html,
      text: text || this.stripHtml(html)
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendVerificationCode(email, code) {
    const subject = 'Код подтверждения записи на прием - Evimed';
    const html = this.getVerificationEmailTemplate(code);
    
    return await this.sendEmail(email, subject, html);
  }

  async sendAppointmentConfirmation(email, appointmentData) {
    const subject = 'Запись на прием подтверждена - Evimed';
    const html = this.getAppointmentConfirmationTemplate(appointmentData);
    
    return await this.sendEmail(email, subject, html);
  }

  async sendAppointmentCancellation(email, appointmentData) {
    const subject = 'Запись на прием отменена - Evimed';
    const html = this.getAppointmentCancellationTemplate(appointmentData);
    
    return await this.sendEmail(email, subject, html);
  }

  getVerificationEmailTemplate(code) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Код подтверждения</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2c5aa0; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .code { font-size: 32px; font-weight: bold; color: #2c5aa0; text-align: center; margin: 20px 0; padding: 20px; background: white; border-radius: 8px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Evimed</h1>
            <p>Код подтверждения записи на прием</p>
          </div>
          <div class="content">
            <h2>Здравствуйте!</h2>
            <p>Для подтверждения записи на прием введите следующий код:</p>
            <div class="code">${code}</div>
            <div class="warning">
              <strong>Важно:</strong> Код действителен в течение 10 минут. Не передавайте его третьим лицам.
            </div>
            <p>Если вы не запрашивали код подтверждения, проигнорируйте это письмо.</p>
          </div>
          <div class="footer">
            <p>С уважением, команда Evimed</p>
            <p>Это письмо отправлено автоматически, не отвечайте на него.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getAppointmentConfirmationTemplate(appointmentData) {
    const { firstName, lastName, doctorName, clinicName, date, time, serviceName } = appointmentData;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Запись подтверждена</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .appointment-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 5px 0; border-bottom: 1px solid #eee; }
          .info-label { font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Evimed</h1>
            <p>Запись на прием подтверждена</p>
          </div>
          <div class="content">
            <h2>Здравствуйте, ${firstName} ${lastName}!</h2>
            <p>Ваша запись на прием успешно подтверждена.</p>
            <div class="appointment-info">
              <div class="info-row">
                <span class="info-label">Врач:</span>
                <span>${doctorName || 'Не указан'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Клиника:</span>
                <span>${clinicName || 'Не указана'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Дата:</span>
                <span>${date || 'Не указана'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Время:</span>
                <span>${time || 'Не указано'}</span>
              </div>
              ${serviceName ? `
              <div class="info-row">
                <span class="info-label">Услуга:</span>
                <span>${serviceName}</span>
              </div>
              ` : ''}
            </div>
            <p>Пожалуйста, приходите на прием за 10-15 минут до назначенного времени.</p>
          </div>
          <div class="footer">
            <p>С уважением, команда Evimed</p>
            <p>Это письмо отправлено автоматически, не отвечайте на него.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getAppointmentCancellationTemplate(appointmentData) {
    const { firstName, lastName, doctorName, clinicName, date, time } = appointmentData;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Запись отменена</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .appointment-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 5px 0; border-bottom: 1px solid #eee; }
          .info-label { font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Evimed</h1>
            <p>Запись на прием отменена</p>
          </div>
          <div class="content">
            <h2>Здравствуйте, ${firstName} ${lastName}!</h2>
            <p>Ваша запись на прием была отменена.</p>
            <div class="appointment-info">
              <div class="info-row">
                <span class="info-label">Врач:</span>
                <span>${doctorName || 'Не указан'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Клиника:</span>
                <span>${clinicName || 'Не указана'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Дата:</span>
                <span>${date || 'Не указана'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Время:</span>
                <span>${time || 'Не указано'}</span>
              </div>
            </div>
            <p>Если у вас есть вопросы, пожалуйста, свяжитесь с нами.</p>
          </div>
          <div class="footer">
            <p>С уважением, команда Evimed</p>
            <p>Это письмо отправлено автоматически, не отвечайте на него.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  isConfigured() {
    return this.transporter !== null;
  }
}

module.exports = new EmailService();
