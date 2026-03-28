'use client';

import React from 'react';
import MetricsGrid from '@/components/MetricsGrid';
import SalesChart from '@/components/SalesChart';
import ThemeSwitch from '@/components/ThemeSwitch';
import FloatingNavbar from '@/components/FloatingNavbar';
import type { MetricCard, SalesData } from '@/types';

// Sample data for demonstration
const sampleMetrics: MetricCard[] = [
  { title: 'إجمالي المبيعات', value: '45,230 ج.م', change: 12.5, isPositive: true, icon: 'sales' },
  { title: 'الطلبات اليوم', value: 24, change: 8.2, isPositive: true, icon: 'orders' },
  { title: 'مستخدمين جدد', value: 18, change: -3.1, isPositive: false, icon: 'users' },
  { title: 'الإيرادات', value: '128,450 ج.م', change: 15.8, isPositive: true, icon: 'revenue' },
];

const sampleSalesData: SalesData[] = [
  { day: 'السبت', sales: 12000, orders: 8 },
  { day: 'الأحد', sales: 8500, orders: 6 },
  { day: 'الإثنين', sales: 15000, orders: 10 },
  { day: 'الثلاثاء', sales: 11000, orders: 7 },
  { day: 'الأربعاء', sales: 18000, orders: 12 },
  { day: 'الخميس', sales: 14000, orders: 9 },
  { day: 'الجمعة', sales: 9500, orders: 5 },
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-base" dir="ltr">
      <FloatingNavbar />

      <div className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Admin Dashboard</h1>
            <p className="text-text-muted">Overview of your store performance and settings</p>
          </div>

          {/* Metrics Grid */}
          <div className="mb-8">
            <MetricsGrid metrics={sampleMetrics} />
          </div>

          {/* Charts & Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sales Chart */}
            <div className="lg:col-span-2">
              <SalesChart data={sampleSalesData} />
            </div>

            {/* Settings */}
            <div className="space-y-6">
              <ThemeSwitch />

              {/* Quick Actions */}
              <div className="p-6 rounded-glass bg-surface border border-border backdrop-blur-glass">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    className="w-full py-3 px-4 bg-accent text-base font-medium rounded-xl 
                                   transition-all hover:shadow-glow-sm"
                  >
                    Add New Product
                  </button>
                  <button
                    className="w-full py-3 px-4 border border-border text-text-primary 
                                   font-medium rounded-xl backdrop-blur-glass
                                   hover:border-accent transition-colors"
                  >
                    View Orders
                  </button>
                  <button
                    className="w-full py-3 px-4 border border-border text-text-primary 
                                   font-medium rounded-xl backdrop-blur-glass
                                   hover:border-accent transition-colors"
                  >
                    Manage Inventory
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
