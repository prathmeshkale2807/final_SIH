import React, { useRef, useState, useEffect } from 'react';

export const OTPInput = ({ length = 6, value, onChange, onComplete }) => {
  const inputRefs = useRef([]);
  const [digits, setDigits] = useState(Array(length).fill(''));

  useEffect(() => {
    if (value) {
      const valArr = value.split('').slice(0, length);
      while (valArr.length < length) valArr.push('');
      setDigits(valArr);
    }
  }, [value, length]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    const digit = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    const combined = newDigits.join('');
    onChange(combined);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (newDigits.every(d => d !== '') && onComplete) {
      onComplete(combined);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pasted) {
      const newDigits = pasted.split('');
      while (newDigits.length < length) newDigits.push('');
      setDigits(newDigits);
      onChange(pasted);
      if (pasted.length === length && onComplete) onComplete(pasted);
      const nextFocus = Math.min(pasted.length, length - 1);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          className="w-11 h-13 sm:w-13 sm:h-14 text-center text-xl sm:text-2xl font-black bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl shadow-sm focus:outline-none transition-all"
        />
      ))}
    </div>
  );
};
