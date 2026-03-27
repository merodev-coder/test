'use client';

import React, { useState, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const CustomDropdown = memo(function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = 'اختر...',
  label,
  error = false,
  errorMessage,
  required = false,
  disabled = false,
  searchable = false,
  clearable = false,
  className = '',
  size = 'md',
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search
  const filteredOptions =
    searchable && searchQuery
      ? options.filter((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
      : options;

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    const option = options.find((opt) => opt.value === optionValue);
    if (option?.disabled) return;

    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  // Size variants
  const sizeClasses = {
    sm: {
      trigger: 'px-3 py-2 text-caption',
      icon: 14,
      list: 'max-h-48',
      item: 'px-3 py-2 text-caption',
    },
    md: {
      trigger: 'px-4 py-3 text-body-sm',
      icon: 18,
      list: 'max-h-64',
      item: 'px-4 py-3 text-body-sm',
    },
    lg: {
      trigger: 'px-5 py-4 text-body',
      icon: 20,
      list: 'max-h-72',
      item: 'px-5 py-4 text-body',
    },
  };

  const { trigger, icon: iconSize, list, item } = sizeClasses[size];

  return (
    <div ref={dropdownRef} className={`relative ${className}`} dir="rtl">
      {/* Label */}
      {label && (
        <label className="block text-body-sm font-semibold text-text-secondary text-text-secondary mb-2">
          {label}
          {required && <span className="text-error me-1">*</span>}
        </label>
      )}

      {/* Trigger */}
      <motion.button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        whileTap={disabled ? {} : { scale: 0.98 }}
        className={`
          w-full flex items-center justify-between gap-3 rounded-xl transition-all duration-200
          ${trigger}
          ${
            disabled
              ? 'cursor-not-allowed opacity-60 bg-surface-tertiary bg-surface-tertiary'
              : 'cursor-pointer bg-surface-secondary bg-surface-secondary hover:border-brand-500/50 dark:hover:border-brand-400/50'
          }
          ${
            error
              ? 'border-2 border-error ring-2 ring-error/20'
              : 'border border-border-light border-border'
          }
        `}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {selectedOption?.icon && (
            <Icon
              name={selectedOption.icon as any}
              size={iconSize as 14 | 16 | 18 | 20}
              className="text-brand-500 text-brand-400 flex-shrink-0"
            />
          )}
          <span
            className={`font-medium truncate ${
              selectedOption
                ? 'text-text-primary text-text-primary'
                : 'text-text-muted text-text-muted'
            }`}
          >
            {selectedOption?.label || placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {clearable && value && !disabled && (
            <motion.button
              type="button"
              onClick={handleClear}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 rounded-full hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary transition-colors"
            >
              <Icon name="XMarkIcon" size={14} className="text-text-muted" />
            </motion.button>
          )}

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <Icon
              name="ChevronDownIcon"
              size={iconSize as 14 | 16 | 18 | 20}
              className="text-text-muted text-text-muted"
            />
          </motion.div>
        </div>
      </motion.button>

      {/* Error Message */}
      <AnimatePresence>
        {error && errorMessage && (
          <motion.p
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            className="text-body-sm text-error mt-1.5 flex items-center gap-1"
          >
            <Icon name="ExclamationCircleIcon" size={14} />
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="absolute z-50 mt-2 w-full rounded-xl overflow-hidden shadow-elevated shadow-elevated border border-border-light border-border bg-surface bg-surface-secondary"
            >
              {/* Search Input */}
              {searchable && (
                <div className="p-3 border-b border-border-light border-border">
                  <div className="relative">
                    <Icon
                      name="MagnifyingGlassIcon"
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                    />
                    <input
                      type="text"
                      placeholder="بحث..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pr-10 pl-3 py-2 text-body-sm bg-surface-tertiary bg-surface-tertiary border border-border-light border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className={`${list} overflow-y-auto`} style={{ scrollbarWidth: 'thin' }}>
                {filteredOptions.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-body-sm text-text-muted">
                      {searchQuery ? 'لا توجد نتائج' : 'لا توجد خيارات'}
                    </p>
                  </div>
                ) : (
                  filteredOptions.map((option, index) => (
                    <motion.button
                      key={option.value}
                      type="button"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleSelect(option.value)}
                      disabled={option.disabled}
                      className={`
                        w-full text-right flex items-center justify-between gap-3 transition-all duration-150
                        ${item}
                        ${
                          option.disabled
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer hover:bg-surface-secondary dark:hover:bg-surface-dark-tertiary'
                        }
                        ${
                          value === option.value
                            ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 text-brand-400'
                            : 'text-text-primary text-text-primary'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        {option.icon && (
                          <Icon
                            name={option.icon as any}
                            size={iconSize as 14 | 16 | 18 | 20}
                            className={
                              value === option.value
                                ? 'text-brand-500 text-brand-400'
                                : 'text-text-muted'
                            }
                          />
                        )}
                        <span className="font-medium">{option.label}</span>
                      </div>

                      {value === option.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-500/20 bg-brand-400/20 flex-shrink-0"
                        >
                          <Icon
                            name="CheckIcon"
                            size={12}
                            className="text-brand-500 text-brand-400"
                          />
                        </motion.div>
                      )}
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

export default CustomDropdown;
