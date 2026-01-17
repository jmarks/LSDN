import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Match {
  id: number;
  name: string;
  age: number;
  location: string;
  bio: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

const Matches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/matches', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const { data } = await response.json();
          setMatches(data);
        } else {
          setError('Failed to fetch matches');
        }
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Matches</h1>
          <p className="mt-2 text-gray-600">Your connections</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {error}
                </h3>
              </div>
            </div>
          </div>
        )}

        {matches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No matches yet</p>
            <p className="text-gray-500 mt-2">Start exploring profiles to find your perfect match</p>
            <Link
              to="/discover"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Start Discovering
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map(match => (
              <div key={match.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500">{match.name.charAt(0)}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">{match.name}</h3>
                      <p className="text-gray-500">{match.age} years old</p>
                      <p className="text-gray-500">{match.location}</p>
                    </div>
                  </div>
                  
                  {match.bio && (
                    <p className="text-gray-700 mb-4">{match.bio}</p>
                  )}

                  {match.lastMessage && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-600 line-clamp-2">{match.lastMessage}</p>
                      {match.lastMessageTime && (
                        <p className="text-xs text-gray-400 mt-1">{match.lastMessageTime}</p>
                      )}
                    </div>
                  )}

                  <Link
                    to={`/messages/${match.id}`}
                    className="block w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Send Message
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
