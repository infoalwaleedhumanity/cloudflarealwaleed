'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getCountries, getCountryCallingCode, AsYouType, CountryCode } from 'libphonenumber-js';
import { ChevronDown, Search, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  className?: string;
}

export default function PhoneInput({ value, onChange, onBlur, name = 'phone', className }: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('SA');
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayNamesAr = useMemo(() => new Intl.DisplayNames(['ar'], { type: 'region' }), []);
  const displayNamesEn = useMemo(() => new Intl.DisplayNames(['en'], { type: 'region' }), []);

  const countries = useMemo(() => {
    return getCountries().map(code => {
      let nameAr: string = code;
      try { nameAr = displayNamesAr.of(code) || code; } catch (e) {}
      let nameEn: string = code;
      try { nameEn = displayNamesEn.of(code) || code; } catch (e) {}
      
      return {
        code,
        dialCode: `+${getCountryCallingCode(code)}`,
        nameAr,
        nameEn,
      };
    }).sort((a, b) => a.nameAr.localeCompare(b.nameAr, 'ar'));
  }, [displayNamesAr, displayNamesEn]);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countries;
    const query = searchQuery.toLowerCase();
    return countries.filter(c => 
      c.nameAr.toLowerCase().includes(query) || 
      c.nameEn.toLowerCase().includes(query) || 
      c.dialCode.includes(query) ||
      c.code.toLowerCase().includes(query)
    );
  }, [countries, searchQuery]);

  useEffect(() => {
    if (value && !inputValue) {
      const asYouType = new AsYouType();
      const formatted = asYouType.input(value);
      const country = asYouType.getCountry();
      if (country) {
        setSelectedCountry(country);
      }
      setInputValue(formatted);
    } else if (!value && inputValue) {
      // النموذج الأب صفّر القيمة من الخارج (بعد الإرسال مثلاً) — نصفّر الحقل الداخلي كذلك
      setInputValue('');
    }
  }, [value]);

  const placeholder = "XXXXXXXXX";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value;
    
    if (!/^[\d\s+\-()]*$/.test(rawValue)) {
      return;
    }

    const asYouType = new AsYouType(selectedCountry);
    const formatted = asYouType.input(rawValue);
    
    const newCountry = asYouType.getCountry();
    if (newCountry && newCountry !== selectedCountry) {
      setSelectedCountry(newCountry);
    }
    
    setInputValue(formatted);
    
    const number = asYouType.getNumber();
    if (number) {
      onChange(number.number as string);
    } else {
      const digits = rawValue.replace(/\D/g, '');
      if (digits) {
        if (rawValue.startsWith('+')) {
          onChange(rawValue);
        } else {
          onChange(`+${getCountryCallingCode(selectedCountry)}${digits}`);
        }
      } else {
        onChange('');
      }
    }
  };

  const handleCountrySelect = (countryCode: CountryCode) => {
    setSelectedCountry(countryCode);
    setIsDropdownOpen(false);
    setSearchQuery('');
    
    const digits = inputValue.replace(/\D/g, '');
    if (digits) {
      const asYouType = new AsYouType(countryCode);
      const formatted = asYouType.input(digits);
      setInputValue(formatted);
      const number = asYouType.getNumber();
      if (number) {
        onChange(number.number as string);
      } else {
        onChange(`+${getCountryCallingCode(countryCode)}${digits}`);
      }
    } else {
      setInputValue('');
      onChange('');
    }
    inputRef.current?.focus();
  };

  return (
    <div className="flex w-full h-13 sm:h-14 bg-transparent relative rounded-2xl items-center" dir="ltr">
      <div className="relative h-full shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-between h-full px-2.5 sm:px-3 text-[var(--primary)] hover:bg-[var(--primary)]/5 border-r border-[var(--primary)]/10 transition-colors rounded-l-2xl gap-1"
          style={{ minWidth: '78px', width: 'auto' }}
        >
          <span className="font-semibold text-xs sm:text-sm font-mono whitespace-nowrap">
            +{getCountryCallingCode(selectedCountry)}
          </span>
          <ChevronDown size={14} className={`text-[var(--primary)]/40 shrink-0 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-[var(--primary)]' : ''}`} />
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 mt-2 w-[260px] sm:w-[320px] max-w-[calc(100vw-2.5rem)] bg-white border border-[var(--primary)]/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
              dir="rtl"
            >
              <div className="p-2.5 sm:p-3 border-b border-[var(--primary)]/5 bg-gray-50/70">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن الدولة أو الرمز..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[var(--primary)]/10 rounded-xl text-xs sm:text-sm font-semibold text-[var(--primary)] outline-none focus:border-[var(--primary)]/30 transition-colors"
                  />
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--primary)]/40" />
                </div>
              </div>
              <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleCountrySelect(c.code as CountryCode)}
                      className={`w-full text-right px-2.5 py-2 rounded-xl flex items-center justify-between transition-colors ${
                        selectedCountry === c.code 
                          ? 'bg-[var(--primary)]/5 text-[var(--primary)] font-bold' 
                          : 'hover:bg-[var(--background)] text-[var(--primary)]/75 font-semibold'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-1">
                        <span className="text-xs sm:text-sm truncate">{c.nameAr}</span>
                        <span className="text-[9px] text-slate-400 font-mono uppercase bg-slate-100 px-1 py-0.5 rounded shrink-0">{c.code}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-500 shrink-0" dir="ltr">{c.dialCode}</span>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-4 text-xs text-[var(--primary)]/40 font-semibold">
                    لا توجد نتائج مطابقة
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center px-2 sm:px-3 text-[var(--primary)]/40 shrink-0">
        <Phone size={15} />
      </div>

      <input
        ref={inputRef}
        type="tel"
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`flex-1 min-w-0 bg-transparent outline-none text-xs sm:text-sm font-semibold text-[var(--primary)] px-2 sm:px-3 rounded-r-2xl h-full ${className || ''}`}
        dir="ltr"
        style={{ textAlign: 'left' }}
      />
    </div>
  );
}
