// src/pages/validate.jsx

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function Validate() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusNext = (index: number) => {
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const focusPrev = (index: number) => {
    if (index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value !== '' && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value) {
      focusNext(index);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '') {
        focusPrev(index);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      focusPrev(index);
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      focusNext(index);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').trim();

    if (!/^\d+$/.test(text)) return;

    const digits = text.split('').slice(0, 6 - index);
    if (digits.length === 0) return;

    const newOtp = [...otp];
    digits.forEach((digit, i) => {
      if (index + i < 6) {
        newOtp[index + i] = digit;
      }
    });

    setOtp(newOtp);

    const nextPosition = Math.min(index + digits.length, 5);
    inputRefs.current[nextPosition]?.focus();
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const isComplete = otp.every((digit) => digit !== '');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header / Branding */}
        <div className="pt-10 pb-6 px-8 flex flex-col items-center bg-gradient-to-b from-blue-50/80 to-white">
          <div className="relative mb-5">
            <div className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-5xl font-bold tracking-tight">P</span>
            </div>
            <svg
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-5 text-blue-400/60"
              viewBox="0 0 48 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M0 10 Q12 0 24 10 T48 10" />
            </svg>
          </div>

          <span className="text-sm font-semibold text-blue-700 tracking-wide uppercase">PENNO</span>

          <h1 className="mt-5 text-2xl sm:text-3xl font-bold text-gray-900">
            Enter OTP
          </h1>

          <p className="mt-3 text-gray-600 text-center text-base leading-relaxed px-2">
            We have sent a 6-digit code to your email
          </p>
        </div>

        {/* OTP input area */}
        <div className="px-8 sm:px-10 pt-8 pb-6">
          <div className="flex justify-center gap-3 sm:gap-4 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
  inputRefs.current[index] = el;
}}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={(e) => handlePaste(e, index)}
                autoComplete="one-time-code"
                className={`
                  w-12 h-14 text-center text-2xl font-semibold
                  border-2 rounded-lg outline-none transition-all duration-150
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-md
                  ${digit
                    ? 'border-blue-600 bg-blue-50/70 text-blue-800 shadow-sm'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                  }
                `}
              />
            ))}
          </div>

          <button
            type="button"
            disabled={!isComplete}
            className={`
              w-full flex items-center justify-center gap-2
              py-3.5 px-6 rounded-xl font-medium text-base shadow-md
              transition-all duration-200
              ${
                isComplete
                  ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
                  : 'bg-blue-400/60 text-white/80 cursor-not-allowed'
              }
            `}
          >
            Verify & Sign In
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        {/* Resend section */}
        <div className="px-8 pb-10 text-center text-sm text-gray-600">
          Didn't receive the code?{' '}
          <button
            type="button"
            className="text-blue-700 font-medium hover:text-blue-800 hover:underline transition-colors"
            // TODO: add resend logic + cooldown later
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
}