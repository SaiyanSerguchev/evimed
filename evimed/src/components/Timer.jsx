import React, { useState, useEffect, useRef } from 'react';
import './Timer.css';

const Timer = ({ 
  initialTime = 600, // 10 минут в секундах
  onTimeUp,
  onTick,
  format = 'mm:ss',
  className = '',
  showIcon = true
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          
          // Вызываем callback при каждом тике
          if (onTick) {
            onTick(newTime);
          }
          
          // Проверяем окончание времени
          if (newTime <= 0) {
            setIsActive(false);
            if (onTimeUp) {
              onTimeUp();
            }
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft, onTick, onTimeUp]);

  // Форматирование времени
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    switch (format) {
      case 'hh:mm:ss':
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      case 'mm:ss':
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      case 'ss':
        return seconds.toString();
      case 'human':
        if (hours > 0) {
          return `${hours}ч ${minutes}м ${secs}с`;
        } else if (minutes > 0) {
          return `${minutes}м ${secs}с`;
        } else {
          return `${secs}с`;
        }
      default:
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };

  // Получение класса для стилизации
  const getTimerClass = () => {
    let className = 'timer';
    
    if (timeLeft <= 60) {
      className += ' timer--warning';
    }
    
    if (timeLeft <= 30) {
      className += ' timer--danger';
    }
    
    if (timeLeft === 0) {
      className += ' timer--expired';
    }
    
    return className;
  };

  // Получение цвета прогресс-бара
  const getProgressColor = () => {
    const progress = (timeLeft / initialTime) * 100;
    
    if (progress <= 20) {
      return '#DC2626'; // Красный
    } else if (progress <= 40) {
      return '#F59E0B'; // Желтый
    } else {
      return '#10B981'; // Зеленый
    }
  };

  // Сброс таймера
  const resetTimer = () => {
    setTimeLeft(initialTime);
    setIsActive(true);
  };

  // Пауза/возобновление
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Экспортируем методы для внешнего использования
  React.useImperativeHandle(React.forwardRef(() => null), () => ({
    resetTimer,
    toggleTimer,
    getTimeLeft: () => timeLeft,
    isActive: () => isActive
  }));

  return (
    <div className={`${getTimerClass()} ${className}`}>
      {showIcon && (
        <div className="timer-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      )}
      
      <div className="timer-content">
        <div className="timer-text">
          {timeLeft > 0 ? formatTime(timeLeft) : 'Время истекло'}
        </div>
        
        {timeLeft > 0 && (
          <div className="timer-progress">
            <div 
              className="timer-progress-bar"
              style={{
                width: `${(timeLeft / initialTime) * 100}%`,
                backgroundColor: getProgressColor()
              }}
            />
          </div>
        )}
      </div>
      
      {timeLeft === 0 && (
        <div className="timer-expired-message">
          Код подтверждения истек
        </div>
      )}
    </div>
  );
};

export default Timer;
