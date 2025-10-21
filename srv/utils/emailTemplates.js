// Email templates utility
class EmailTemplates {
  static getVerificationCodeTemplate(code, expiryMinutes = 10) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Код подтверждения</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f4f4f4;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header { 
            background: #2c5aa0; 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 { margin: 0; font-size: 28px; }
          .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
          .content { padding: 40px 30px; }
          .content h2 { color: #2c5aa0; margin-top: 0; }
          .code { 
            font-size: 36px; 
            font-weight: bold; 
            color: #2c5aa0; 
            text-align: center; 
            margin: 30px 0; 
            padding: 25px; 
            background: #f8f9fa; 
            border-radius: 10px; 
            border: 2px dashed #2c5aa0;
            letter-spacing: 5px;
          }
          .footer { 
            text-align: center; 
            padding: 30px; 
            color: #666; 
            font-size: 14px; 
            background: #f8f9fa;
            border-top: 1px solid #eee;
          }
          .warning { 
            background: #fff3cd; 
            border: 1px solid #ffeaa7; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 25px 0; 
            color: #856404;
          }
          .warning strong { color: #721c24; }
          .button {
            display: inline-block;
            background: #2c5aa0;
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
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
              <strong>Важно:</strong> Код действителен в течение ${expiryMinutes} минут. Не передавайте его третьим лицам.
            </div>
            <p>Если вы не запрашивали код подтверждения, проигнорируйте это письмо.</p>
            <p>С уважением,<br>команда Evimed</p>
          </div>
          <div class="footer">
            <p>Это письмо отправлено автоматически, не отвечайте на него.</p>
            <p>© 2025 Evimed. Все права защищены.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  static getAppointmentConfirmationTemplate(appointmentData) {
    const { firstName, lastName, doctorName, clinicName, date, time, serviceName, phone } = appointmentData;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Запись подтверждена</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f4f4f4;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header { 
            background: #28a745; 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 { margin: 0; font-size: 28px; }
          .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
          .content { padding: 40px 30px; }
          .content h2 { color: #28a745; margin-top: 0; }
          .appointment-info { 
            background: #f8f9fa; 
            padding: 25px; 
            border-radius: 10px; 
            margin: 25px 0; 
            border-left: 4px solid #28a745;
          }
          .info-row { 
            display: flex; 
            justify-content: space-between; 
            margin: 15px 0; 
            padding: 8px 0; 
            border-bottom: 1px solid #dee2e6; 
          }
          .info-row:last-child { border-bottom: none; }
          .info-label { font-weight: bold; color: #495057; }
          .info-value { color: #212529; }
          .footer { 
            text-align: center; 
            padding: 30px; 
            color: #666; 
            font-size: 14px; 
            background: #f8f9fa;
            border-top: 1px solid #eee;
          }
          .success-icon {
            font-size: 48px;
            color: #28a745;
            text-align: center;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Evimed</h1>
            <p>Запись на прием подтверждена</p>
          </div>
          <div class="content">
            <div class="success-icon">✓</div>
            <h2>Здравствуйте, ${firstName} ${lastName}!</h2>
            <p>Ваша запись на прием успешно подтверждена.</p>
            <div class="appointment-info">
              <div class="info-row">
                <span class="info-label">Врач:</span>
                <span class="info-value">${doctorName || 'Не указан'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Клиника:</span>
                <span class="info-value">${clinicName || 'Не указана'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Дата:</span>
                <span class="info-value">${date || 'Не указана'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Время:</span>
                <span class="info-value">${time || 'Не указано'}</span>
              </div>
              ${serviceName ? `
              <div class="info-row">
                <span class="info-label">Услуга:</span>
                <span class="info-value">${serviceName}</span>
              </div>
              ` : ''}
              ${phone ? `
              <div class="info-row">
                <span class="info-label">Телефон:</span>
                <span class="info-value">${phone}</span>
              </div>
              ` : ''}
            </div>
            <p><strong>Важно:</strong> Пожалуйста, приходите на прием за 10-15 минут до назначенного времени.</p>
            <p>Если у вас возникли вопросы, свяжитесь с нами по телефону или через сайт.</p>
          </div>
          <div class="footer">
            <p>С уважением, команда Evimed</p>
            <p>Это письмо отправлено автоматически, не отвечайте на него.</p>
            <p>© 2025 Evimed. Все права защищены.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  static getAppointmentCancellationTemplate(appointmentData) {
    const { firstName, lastName, doctorName, clinicName, date, time, reason } = appointmentData;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Запись отменена</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f4f4f4;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header { 
            background: #dc3545; 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 { margin: 0; font-size: 28px; }
          .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
          .content { padding: 40px 30px; }
          .content h2 { color: #dc3545; margin-top: 0; }
          .appointment-info { 
            background: #f8f9fa; 
            padding: 25px; 
            border-radius: 10px; 
            margin: 25px 0; 
            border-left: 4px solid #dc3545;
          }
          .info-row { 
            display: flex; 
            justify-content: space-between; 
            margin: 15px 0; 
            padding: 8px 0; 
            border-bottom: 1px solid #dee2e6; 
          }
          .info-row:last-child { border-bottom: none; }
          .info-label { font-weight: bold; color: #495057; }
          .info-value { color: #212529; }
          .footer { 
            text-align: center; 
            padding: 30px; 
            color: #666; 
            font-size: 14px; 
            background: #f8f9fa;
            border-top: 1px solid #eee;
          }
          .cancel-icon {
            font-size: 48px;
            color: #dc3545;
            text-align: center;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Evimed</h1>
            <p>Запись на прием отменена</p>
          </div>
          <div class="content">
            <div class="cancel-icon">✗</div>
            <h2>Здравствуйте, ${firstName} ${lastName}!</h2>
            <p>Ваша запись на прием была отменена.</p>
            <div class="appointment-info">
              <div class="info-row">
                <span class="info-label">Врач:</span>
                <span class="info-value">${doctorName || 'Не указан'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Клиника:</span>
                <span class="info-value">${clinicName || 'Не указана'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Дата:</span>
                <span class="info-value">${date || 'Не указана'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Время:</span>
                <span class="info-value">${time || 'Не указано'}</span>
              </div>
              ${reason ? `
              <div class="info-row">
                <span class="info-label">Причина:</span>
                <span class="info-value">${reason}</span>
              </div>
              ` : ''}
            </div>
            <p>Если у вас есть вопросы или вы хотите записаться на другое время, пожалуйста, свяжитесь с нами.</p>
            <p>Мы будем рады помочь вам с новой записью.</p>
          </div>
          <div class="footer">
            <p>С уважением, команда Evimed</p>
            <p>Это письмо отправлено автоматически, не отвечайте на него.</p>
            <p>© 2025 Evimed. Все права защищены.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  static getPasswordResetTemplate(resetLink, expiryHours = 24) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Сброс пароля</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f4f4f4;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header { 
            background: #6c757d; 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 { margin: 0; font-size: 28px; }
          .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
          .content { padding: 40px 30px; }
          .content h2 { color: #6c757d; margin-top: 0; }
          .button {
            display: inline-block;
            background: #007bff;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            margin: 25px 0;
            font-weight: bold;
          }
          .footer { 
            text-align: center; 
            padding: 30px; 
            color: #666; 
            font-size: 14px; 
            background: #f8f9fa;
            border-top: 1px solid #eee;
          }
          .warning { 
            background: #fff3cd; 
            border: 1px solid #ffeaa7; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 25px 0; 
            color: #856404;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Evimed</h1>
            <p>Сброс пароля</p>
          </div>
          <div class="content">
            <h2>Сброс пароля</h2>
            <p>Вы запросили сброс пароля для вашего аккаунта.</p>
            <p>Нажмите на кнопку ниже, чтобы создать новый пароль:</p>
            <div style="text-align: center;">
              <a href="${resetLink}" class="button">Сбросить пароль</a>
            </div>
            <div class="warning">
              <strong>Важно:</strong> Ссылка действительна в течение ${expiryHours} часов. Если вы не запрашивали сброс пароля, проигнорируйте это письмо.
            </div>
            <p>Если кнопка не работает, скопируйте и вставьте эту ссылку в браузер:</p>
            <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px;">${resetLink}</p>
          </div>
          <div class="footer">
            <p>С уважением, команда Evimed</p>
            <p>Это письмо отправлено автоматически, не отвечайте на него.</p>
            <p>© 2025 Evimed. Все права защищены.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = EmailTemplates;
