import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Match {
  id: number;
  name: string;
  age: number;
  location: string;
  bio: string;
  interests: string[];
  relationshipGoal: string;
  matchScore: number;
  distance: number;
  lastMessage?: string;
  lastMessageTime?: string;
  profilePhoto?: string;
}

interface Filters {
  minAge: number;
  maxAge: number;
  maxDistance: number;
  interests: string[];
  relationshipGoals: string[];
}

interface SortOption {
  value: string;
  label: string;
}

const Matches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('matchScore');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    minAge: 18,
    maxAge: 100,
    maxDistance: 50,
    interests: [],
    relationshipGoals: [],
  });

  const sortOptions: SortOption[] = [
    { value: 'matchScore', label: 'Match Score' },
    { value: 'age', label: 'Age' },
    { value: 'distance', label: 'Distance' },
  ];

  const allInterests = ['Art', 'Music', 'Travel', 'Food', 'Fitness', 'Reading', 'Movies', 'Outdoors', 'Cooking', 'Gaming'];
  const relationshipGoals = ['Casual Dating', 'Long-term Relationship', 'Marriage', 'Friendship'];

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
          const mockMatches = data.length > 0 ? data : generateMockMatches();
          setMatches(mockMatches);
          setFilteredMatches(mockMatches);
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

  const generateMockMatches = (): Match[] => {
    const mockData: Match[] = [
      {
        id: 1,
        name: 'Sarah Johnson',
        age: 28,
        location: 'Downtown',
        bio: 'Coffee enthusiast, book lover, and weekend hiker. Looking for someone to explore the city with.',
        interests: ['Reading', 'Coffee', 'Hiking'],
        relationshipGoal: 'Long-term Relationship',
        matchScore: 95,
        distance: 2,
        lastMessage: 'Hey! How was your weekend hike?',
        lastMessageTime: '2 hours ago',
      },
      {
        id: 2,
        name: 'Mike Chen',
        age: 32,
        location: 'Westside',
        bio: 'Foodie, tech lover, and movie buff. Love trying new restaurants and exploring new places.',
        interests: ['Food', 'Movies', 'Travel'],
        relationshipGoal: 'Casual Dating',
        matchScore: 88,
        distance: 5,
      },
      {
        id: 3,
        name: 'Emily Rodriguez',
        age: 26,
        location: 'East End',
        bio: 'Yoga instructor and plant mom. Looking for someone with a positive attitude and love for nature.',
        interests: ['Fitness', 'Outdoors', 'Art'],
        relationshipGoal: 'Long-term Relationship',
        matchScore: 92,
        distance: 3,
        lastMessage: 'That sounds amazing! When should we plan this?',
        lastMessageTime: '1 day ago',
      },
      {
        id: 4,
        name: 'David Kim',
        age: 30,
        location: 'Northgate',
        bio: 'Gamer, music fan, and amateur chef. Looking for someone to share laughs and good food with.',
        interests: ['Gaming', 'Music', 'Cooking'],
        relationshipGoal: 'Friendship',
        matchScore: 85,
        distance: 8,
      },
      {
        id: 5,
        name: 'Lisa Wong',
        age: 29,
        location: 'South Bay',
        bio: 'Travel blogger and photography enthusiast. Looking for a partner in crime to explore the world.',
        interests: ['Travel', 'Photography', 'Art'],
        relationshipGoal: 'Long-term Relationship',
        matchScore: 90,
        distance: 10,
        lastMessage: 'Check out this new coffee shop I found!',
        lastMessageTime: '3 days ago',
      },
    ];
    return mockData;
  };

  const applyFilters = () => {
    let filtered = [...matches];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(match =>
        match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.interests.some(interest => interest.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Age filter
    filtered = filtered.filter(match =>
      match.age >= filters.minAge && match.age <= filters.maxAge
    );

    // Distance filter
    filtered = filtered.filter(match => match.distance <= filters.maxDistance);

    // Interests filter
    if (filters.interests.length > 0) {
      filtered = filtered.filter(match =>
        match.interests.some(interest => filters.interests.includes(interest))
      );
    }

    // Relationship goals filter
    if (filters.relationshipGoals.length > 0) {
      filtered = filtered.filter(match =>
        filters.relationshipGoals.includes(match.relationshipGoal)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'age':
          return a.age - b.age;
        case 'distance':
          return a.distance - b.distance;
        case 'matchScore':
        default:
          return b.matchScore - a.matchScore;
      }
    });

    setFilteredMatches(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, sortBy, filters, matches]);

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleInterestFilter = (interest: string) => {
    setFilters(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const toggleRelationshipGoalFilter = (goal: string) => {
    setFilters(prev => ({
      ...prev,
      relationshipGoals: prev.relationshipGoals.includes(goal)
        ? prev.relationshipGoals.filter(g => g !== goal)
        : [...prev.relationshipGoals, goal],
    }));
  };

  const clearFilters = () => {
    setFilters({
      minAge: 18,
      maxAge: 100,
      maxDistance: 50,
      interests: [],
      relationshipGoals: [],
    });
    setSearchTerm('');
    setSortBy('matchScore');
  };

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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Matches</h1>
          <p className="mt-2 text-gray-600">Discover your connections</p>
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

        {/* Search and Sort */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search matches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md transition-all duration-200"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 18v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Filters Sidebar/Drawer */}
        {showFilters && (
          <div className="mb-6 bg-white rounded-lg shadow-md p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                Clear all filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Age Range */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Age Range</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.minAge}
                    onChange={(e) => handleFilterChange('minAge', parseInt(e.target.value))}
                    min="18"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={filters.maxAge}
                    onChange={(e) => handleFilterChange('maxAge', parseInt(e.target.value))}
                    min="18"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Distance */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Max Distance (miles)</h3>
                <input
                  type="number"
                  value={filters.maxDistance}
                  onChange={(e) => handleFilterChange('maxDistance', parseInt(e.target.value))}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                />
              </div>

              {/* Interests */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {allInterests.map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleInterestFilter(interest)}
                      className={`px-3 py-1 text-sm rounded-full transition-all duration-200 ${
                        filters.interests.includes(interest)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Relationship Goals */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Relationship Goals</h3>
                <div className="flex flex-wrap gap-2">
                  {relationshipGoals.map(goal => (
                    <button
                      key={goal}
                      onClick={() => toggleRelationshipGoalFilter(goal)}
                      className={`px-3 py-1 text-sm rounded-full transition-all duration-200 ${
                        filters.relationshipGoals.includes(goal)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowFilters(false)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Match Cards */}
        {filteredMatches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No matches found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters to find more matches</p>
            <button
              onClick={clearFilters}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map(match => (
              <div
                key={match.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative">
                  {match.profilePhoto ? (
                    <img
                      src={match.profilePhoto}
                      alt={match.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">{match.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {match.matchScore}% Match
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{match.name}</h3>
                      <p className="text-gray-500">{match.age} years old • {match.distance} miles away</p>
                    </div>
                  </div>

                  {match.bio && (
                    <p className="text-gray-700 mb-4 line-clamp-3">{match.bio}</p>
                  )}

                  {match.interests.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {match.interests.slice(0, 3).map(interest => (
                        <span
                          key={interest}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                      {match.interests.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                          +{match.interests.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">
                      Seeking: {match.relationshipGoal}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {match.distance} miles
                    </div>
                  </div>

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
                    className="block w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    Send Message
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filter Count */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Showing {filteredMatches.length} of {matches.length} matches
        </div>
      </div>
    </div>
  );
};

export default Matches;
