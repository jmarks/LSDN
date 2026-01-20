import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const OrderConfirmation: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState<string>('');

  useEffect(() => {
    // Generate random order number
    const randomOrderNumber = 'LSDN-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    setOrderNumber(randomOrderNumber);

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="mt-4 text-gray-600 text-lg">
            Thank you for your purchase. Your order has been processed successfully.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
                <p className="text-gray-600 mt-1">Order Number: {orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                <p className="text-green-600 font-semibold mt-1">Paid</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 mb-2">
                  <strong>John Doe</strong><br />
                  123 Main St<br />
                  New York, NY 10001<br />
                  United States<br />
                  (123) 456-7890
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 mb-2">
                  <strong>Credit Card</strong><br />
                  **** **** **** 1112<br />
                  Expires: 12/25
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold">P</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Premium Date Night Package</h4>
                    <p className="text-gray-500 text-sm">Qty: 1</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">$199.99</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>$199.99</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (8%)</span>
                <span>$16.00</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-900 pt-4">
                <span>Total</span>
                <span>$215.99</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex space-x-4">
            <Link
              to="/packages"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Browse More Packages
            </Link>
            <Link
              to="/discover"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Start Browsing Matches
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-600">
            If you have any questions about your order, please contact our support team at{' '}
            <a href="mailto:support@lsdn.com" className="text-indigo-600 hover:text-indigo-800 font-medium">
              support@lsdn.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
