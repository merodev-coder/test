'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface StorageProgressBarProps {
  total: number;
  used: number;
  hasDrive: boolean;
}

export default function StorageProgressBar({ total, used, hasDrive }: StorageProgressBarProps) {
  if (!hasDrive) return null;

  const percent = Math.min(Math.round((used / total) * 100), 100);
  const remaining = total - used;
  const isWarning = percent > 85;
  const isFull = percent >= 100;

  return (
    <div className="storage-bar-container fixed bottom-0 right-0 left-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        {/* Drive Icon */}
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isWarning ? 'bg-red-500/20' : 'bg-brand-500/10'}`}
        >
          <Icon
            name="CircleStackIcon"
            size={16}
            className={isWarning ? 'text-red-400' : 'text-brand-500'}
          />
        </div>

        {/* Label */}
        <div className="hidden md:flex flex-col leading-none flex-shrink-0">
          <span className="text-xs font-black text-text-primary text-text-primary">سعة الهارد</span>
          <span
            className={`text-[10px] font-bold ${isWarning ? 'text-red-400' : 'text-brand-500'}`}
          >
            {isFull ? 'ممتلئ!' : `${remaining} GB متبقي`}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 flex items-center gap-3">
          <div className="storage-bar-track flex-1 h-2.5 rounded-full overflow-hidden">
            <div
              className={`storage-bar-fill h-full transition-all duration-800 ${isWarning ? 'warning' : ''}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <span
            className={`text-xs font-black flex-shrink-0 ${isWarning ? 'text-red-400' : 'text-brand-500'}`}
          >
            {used}/{total} GB
          </span>
        </div>

        {/* Warning / Add Button */}
        {isFull ? (
          <span className="text-xs font-black text-red-400 flex-shrink-0 flex items-center gap-1">
            <Icon name="ExclamationTriangleIcon" size={14} />
            <span className="hidden md:inline">الهارد ممتلئ</span>
          </span>
        ) : (
          <Link
            href="/products?cat=games"
            className="btn-primary px-4 py-2 text-xs font-black flex-shrink-0 flex items-center gap-1.5 relative z-10"
          >
            <span className="relative z-10 hidden md:inline">أضف داتا</span>
            <Icon name="PlusIcon" size={14} className="text-bg-deep relative z-10" />
          </Link>
        )}
      </div>
    </div>
  );
}
