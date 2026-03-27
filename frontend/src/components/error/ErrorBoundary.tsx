'use client';

import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  featureName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary for e-commerce features
 * Catches JavaScript errors in child components and displays fallback UI
 */
export class EcommerceErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console for now - can be replaced with error tracking service
    console.error(`[${this.props.featureName}] Error:`, error, errorInfo);

    // Could send to error tracking service:
    // logErrorToService({
    //   error,
    //   errorInfo,
    //   feature: this.props.featureName,
    //   timestamp: new Date().toISOString(),
    //   userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    //   url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    // });
  }

  handleReset = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2 text-red-900 dark:text-red-100">
              حدث خطأ غير متوقع
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              لا يمكن تحميل هذا القسم. يرجى المحاولة مرة أخرى.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
              >
                إعادة المحاولة
              </button>
              <button
                onClick={() => typeof window !== 'undefined' && window.location.reload()}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                تحديث الصفحة
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Pre-configured error boundaries for common features
export function CartErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <EcommerceErrorBoundary
      featureName="cart"
      fallback={
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <p className="text-amber-700 dark:text-amber-300 text-sm">
            لا يمكن تحميل السلة. يرجى{' '}
            <a href="/cart" className="underline font-medium">
              الانتقال لصفحة السلة
            </a>
          </p>
        </div>
      }
    >
      {children}
    </EcommerceErrorBoundary>
  );
}

export function CheckoutErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <EcommerceErrorBoundary
      featureName="checkout"
      fallback={
        <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
          <h3 className="font-bold text-lg mb-2">تعذر تحميل صفحة الدفع</h3>
          <p className="text-sm text-gray-600 text-gray-400 mb-4">
            حدث خطأ في تحميل نظام الدفع. يرجى المحاولة مرة أخرى.
          </p>
          <a
            href="/cart"
            className="inline-block px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
          >
            العودة للسلة
          </a>
        </div>
      }
    >
      {children}
    </EcommerceErrorBoundary>
  );
}

export function ProductGridErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <EcommerceErrorBoundary
      featureName="product-grid"
      fallback={
        <div className="p-8 text-center">
          <p className="text-gray-600 text-gray-400 mb-4">
            لا يمكن تحميل المنتجات. يرجى تحديث الصفحة.
          </p>
          <button
            onClick={() => typeof window !== 'undefined' && window.location.reload()}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg"
          >
            تحديث
          </button>
        </div>
      }
    >
      {children}
    </EcommerceErrorBoundary>
  );
}
