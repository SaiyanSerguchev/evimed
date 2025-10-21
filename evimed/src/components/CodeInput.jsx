import React, { useState, useRef, useEffect } from 'react';
import './CodeInput.css';

const CodeInput = ({ 
  length = 4, 
  onComplete, 
  onChange, 
  disabled = false,
  error = false,
  autoFocus = true 
}) => {
  const [code, setCode] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  // Автофокус на первый input
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  // Обработка изменения значения в поле
  const handleChange = (index, value) => {
    // Разрешаем только цифры
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue.length > 1) {
      // Если вставлен код целиком, разбиваем его
      const digits = numericValue.split('').slice(0, length);
      const newCode = [...code];
      
      digits.forEach((digit, i) => {
        if (i < length) {
          newCode[i] = digit;
        }
      });
      
      setCode(newCode);
      
      // Фокус на последнее заполненное поле
      const lastFilledIndex = Math.min(digits.length - 1, length - 1);
      if (inputRefs.current[lastFilledIndex]) {
        inputRefs.current[lastFilledIndex].focus();
      }
      
      // Вызываем callback
      if (onChange) {
        onChange(newCode.join(''));
      }
      
      // Проверяем завершенность
      if (newCode.every(digit => digit !== '')) {
        onComplete?.(newCode.join(''));
      }
      
      return;
    }
    
    const newCode = [...code];
    newCode[index] = numericValue;
    setCode(newCode);
    
    // Вызываем callback
    if (onChange) {
      onChange(newCode.join(''));
    }
    
    // Переход к следующему полю
    if (numericValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Проверяем завершенность
    if (newCode.every(digit => digit !== '')) {
      onComplete?.(newCode.join(''));
    }
  };

  // Обработка нажатий клавиш
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        // Если поле пустое, переходим к предыдущему
        inputRefs.current[index - 1]?.focus();
      } else {
        // Очищаем текущее поле
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
        
        if (onChange) {
          onChange(newCode.join(''));
        }
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Delete') {
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
      
      if (onChange) {
        onChange(newCode.join(''));
      }
    }
  };

  // Обработка вставки
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    
    if (pastedData.length > 0) {
      const digits = pastedData.split('').slice(0, length);
      const newCode = [...code];
      
      digits.forEach((digit, i) => {
        if (i < length) {
          newCode[i] = digit;
        }
      });
      
      setCode(newCode);
      
      // Фокус на последнее заполненное поле
      const lastFilledIndex = Math.min(digits.length - 1, length - 1);
      if (inputRefs.current[lastFilledIndex]) {
        inputRefs.current[lastFilledIndex].focus();
      }
      
      if (onChange) {
        onChange(newCode.join(''));
      }
      
      if (newCode.every(digit => digit !== '')) {
        onComplete?.(newCode.join(''));
      }
    }
  };

  // Очистка кода
  const clearCode = () => {
    setCode(Array(length).fill(''));
    if (onChange) {
      onChange('');
    }
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  // Установка значения извне
  const setValue = (value) => {
    const digits = value.replace(/\D/g, '').split('').slice(0, length);
    const newCode = Array(length).fill('');
    
    digits.forEach((digit, i) => {
      if (i < length) {
        newCode[i] = digit;
      }
    });
    
    setCode(newCode);
    
    if (onChange) {
      onChange(newCode.join(''));
    }
  };

  // Экспортируем методы для внешнего использования
  React.useImperativeHandle(React.forwardRef(() => null), () => ({
    clearCode,
    setValue,
    focus: () => inputRefs.current[0]?.focus()
  }));

  return (
    <div className={`code-input ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
      <div className="code-input-container">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`code-input-field ${digit ? 'filled' : ''}`}
            autoComplete="off"
          />
        ))}
      </div>
      
      {error && (
        <div className="code-input-error">
          Неверный код подтверждения
        </div>
      )}
      
      <div className="code-input-hint">
        Введите {length}-значный код из письма
      </div>
    </div>
  );
};

export default CodeInput;
