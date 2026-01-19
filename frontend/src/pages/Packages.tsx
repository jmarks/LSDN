import React, { useState, useEffect } from 'react';

interface Package {
  id: string;
  name: string;
  description: string;
  price: string;
  durationMinutes: number;
  maxParticipants: number;
  isActive: boolean;
  totalPrice: string;
}

const Packages: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/packages');
        if (response.ok) {
          const { data } = await response.json();
          setPackages(data.packages);
        } else {
          setError('Failed to fetch packages');
        }
      } catch (err) {
        console.error('Error fetching packages:', err);
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handlePurchase = async (packageId: string) => {
    try {
      setPurchasing(packageId);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/packages/${packageId}/purchase`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Package purchased successfully!');
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Purchase failed' }));
        throw new Error(errorData.message || 'Purchase failed');
      }
    } catch (err) {
      console.error('Error purchasing package:', err);
      setError(err instanceof Error ? err.message : 'Failed to purchase package');
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Date Night Packages</h1>
          <p className="mt-4 text-gray-600 text-lg">Choose the perfect package for your special night</p>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {error}
                </h3>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map(pkg => (
            <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{pkg.name}</h3>
                  <p className="text-gray-500 mt-2">{pkg.durationMinutes} minutes</p>
                </div>

                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-indigo-600">${Number(pkg.price).toFixed(2)}</span>
                </div>

                <p className="text-gray-700 mb-6 text-center">{pkg.description}</p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-5 w-5 text-green-400">
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-600">For up to {pkg.maxParticipants} people</p>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-5 w-5 text-green-400">
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-600">Total: ${Number(pkg.totalPrice).toFixed(2)}</p>
                  </div>
                </div>

                <button
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={purchasing === pkg.id}
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {purchasing === pkg.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Purchasing...
                    </>
                  ) : (
                    'Purchase Package'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Packages;
