import React, { useState, useEffect } from 'react';
import CodeInput from './CodeInput';
import Timer from './Timer';
import verificationApi from '../services/verificationApi';
import { handleVerificationError } from '../utils/errorHandler';
import './EmailVerificationModal.css';

const EmailVerificationModal = ({ 
  isOpen, 
  onClose, 
  email, 
  appointmentData,
  onSuccess 
}) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [timeLeft, setTimeLeft] = useState(600); // 10 минут
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60); // 1 минута
  const [isResending, setIsResending] = useState(false);

  // Сброс состояния при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      setCode('');
      setError('');
      setAttemptsLeft(3);
      setTimeLeft(600);
      setCanResend(false);
      setResendCooldown(60);
    }
  }, [isOpen]);

  // Таймер для возможности повторной отправки
  useEffect(() => {
    if (isOpen && !canResend) {
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, canResend]);

  // Обработка ввода кода
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setError(''); // Очищаем ошибку при изменении кода
  };

  // Обработка завершения ввода кода
  const handleCodeComplete = async (completedCode) => {
    if (completedCode.length === 4) {
      await verifyCode(completedCode);
    }
  };

  // Проверка кода
  const verifyCode = async (codeToVerify = code) => {
    if (!codeToVerify || codeToVerify.length !== 4) {
      setError('Введите 4-значный код');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await verificationApi.verifyCode(email, codeToVerify);
      
      if (response.success) {
        // Успешная верификация
        onSuccess?.(response);
        onClose();
      } else {
        setError(response.message || 'Неверный код подтверждения');
        setAttemptsLeft(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      const handledError = handleVerificationError(error);
      setError(handledError.message);
      
      if (handledError.code === 'MAX_ATTEMPTS') {
        setAttemptsLeft(0);
      } else if (handledError.code === 'INVALID_CODE') {
        setAttemptsLeft(prev => Math.max(0, prev - 1));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Повторная отправка кода
  const handleResendCode = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    setError('');

    try {
      const response = await verificationApi.resendCode(email);
      
      if (response.success) {
        setCode('');
        setAttemptsLeft(3);
        setTimeLeft(600);
        setCanResend(false);
        setResendCooldown(60);
        setError('');
      } else {
        setError(response.message || 'Не удалось отправить код повторно');
      }
    } catch (error) {
      const handledError = handleVerificationError(error);
      setError(handledError.message);
    } finally {
      setIsResending(false);
    }
  };

  // Обработка закрытия модального окна
  const handleClose = () => {
    if (!isLoading && !isResending) {
      onClose();
    }
  };

  // Обработка нажатия Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, isLoading, isResending]);

  if (!isOpen) return null;

  return (
    <div className="email-verification-overlay" onClick={handleClose}>
      <div className="email-verification-modal" onClick={(e) => e.stopPropagation()}>
        <button 
          className="email-verification-close" 
          onClick={handleClose}
          disabled={isLoading || isResending}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="email-verification-header">
          <div className="email-verification-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
              <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h2 className="email-verification-title">Подтвердите ваш email</h2>
          <p className="email-verification-subtitle">
            Мы отправили код подтверждения на <strong>{email}</strong>
          </p>
        </div>

        <div className="email-verification-body">
          <div className="verification-timer">
            <Timer
              initialTime={timeLeft}
              onTimeUp={() => setTimeLeft(0)}
              onTick={setTimeLeft}
              format="mm:ss"
              showIcon={true}
            />
          </div>

          <div className="verification-code-section">
            <CodeInput
              length={4}
              onComplete={handleCodeComplete}
              onChange={handleCodeChange}
              disabled={isLoading || timeLeft === 0}
              error={!!error}
              autoFocus={true}
            />
          </div>

          {error && (
            <div className="verification-error">
              {error}
            </div>
          )}

          <div className="verification-info">
            <div className="verification-attempts">
              Осталось попыток: <span className={attemptsLeft <= 1 ? 'warning' : ''}>{attemptsLeft}</span>
            </div>
            
            {timeLeft === 0 && (
              <div className="verification-expired">
                Код подтверждения истек. Запросите новый код.
              </div>
            )}
          </div>

          <div className="verification-actions">
            <button
              className="btn btn-primary"
              onClick={() => verifyCode()}
              disabled={isLoading || code.length !== 4 || timeLeft === 0 || attemptsLeft === 0}
            >
              {isLoading ? (
                <>
                  <div className="spinner" />
                  Проверка...
                </>
              ) : (
                'Подтвердить'
              )}
            </button>

            <button
              className="btn btn-secondary"
              onClick={handleResendCode}
              disabled={!canResend || isResending || isLoading}
            >
              {isResending ? (
                <>
                  <div className="spinner" />
                  Отправка...
                </>
              ) : canResend ? (
                'Отправить код повторно'
              ) : (
                `Повторная отправка через ${resendCooldown}с`
              )}
            </button>
          </div>
        </div>

        <div className="email-verification-footer">
          <p className="verification-help">
            Не получили письмо? Проверьте папку "Спам" или попробуйте отправить код повторно.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
