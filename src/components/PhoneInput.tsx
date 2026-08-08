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
    <div className="flex w-full h-14 bg-transparent relative rounded-2xl" dir="ltr">
      <div className="relative h-full" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-between h-full px-3 text-[#033500] hover:bg-[#033500]/5 border-r border-[#033500]/10 transition-colors rounded-l-2xl"
          style={{ width: '90px' }}
        >
          <span className="font-semibold text-sm font-mono">
            +{getCountryCallingCode(selectedCountry)}
          </span>
          <ChevronDown size={14} className={`text-[#033500]/40 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-[#033500]' : ''}`} />
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 mt-2 w-[280px] sm:w-[320px] bg-white border border-[#033500]/10 rounded-2xl shadow-xl z-50 overflow-hidden"
              dir="rtl"
            >
              <div className="p-3 border-b border-[#033500]/5 bg-gray-50/50">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن الدولة أو الرمز..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#033500]/10 rounded-xl text-sm font-semibold text-[#033500] outline-none focus:border-[#033500]/30 transition-colors"
                  />
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#033500]/40" />
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto p-2">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleCountrySelect(c.code as CountryCode)}
                      className={`w-full text-right px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                        selectedCountry === c.code 
                          ? 'bg-[#033500]/5 text-[#033500] font-bold' 
                          : 'hover:bg-[#F8FAF7] text-[#033500]/70 font-semibold'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{c.nameAr}</span>
                        <span className="text-[10px] text-slate-400 font-mono uppercase bg-slate-100 px-1.5 py-0.5 rounded">{c.code}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-500" dir="ltr">{c.dialCode}</span>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-4 text-sm text-[#033500]/40 font-semibold">
                    لا توجد نتائج مطابقة
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center px-3 text-[#033500]/40">
        <Phone size={16} />
      </div>

      <input
        ref={inputRef}
        type="tel"
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`flex-1 min-w-0 bg-transparent outline-none text-sm font-semibold text-[#033500] px-3 rounded-r-2xl ${className || ''}`}
        dir="ltr"
        style={{ textAlign: 'left' }}
      />
    </div>
  );
}
