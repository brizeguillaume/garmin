import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { format, addDays, subDays } from 'date-fns';
import { useUser } from '../contexts/UserContext';
import { 
  Calendar,
  BarChart3,
  TrendingUp,
  Clock,
  Filter
} from 'lucide-react';
import { 
  generateMockActivities, 
  generateWeeklyStats,
  generateMonthlyStats 
} from '../services/mockData';
import { Activity, ChartData, PeriodFilter, SportType, SPORT_TYPES } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [weeklyDistance, setWeeklyDistance] = useState<ChartData[]>([]);
  const [monthlyDistance, setMonthlyDistance] = useState<ChartData[]>([]);
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'year'>('week');
  const [sportFilter, setSportFilter] = useState<SportType>('All');
  const [loading, setLoading] = useState(true);
  
  // Fetch mock data
  useEffect(() => {
    setLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      const allActivities = generateMockActivities();
      setActivities(allActivities);
      setFilteredActivities(allActivities);
      setWeeklyDistance(generateWeeklyStats());
      setMonthlyDistance(generateMonthlyStats());
      setLoading(false);
    }, 800);
  }, []);

  // Filter activities when sport type changes
  useEffect(() => {
    if (sportFilter === 'All') {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(activities.filter(activity => activity.type === sportFilter));
    }
  }, [sportFilter, activities]);
  
  // Calculate summary statistics
  const calculateStats = () => {
    if (filteredActivities.length === 0) return { 
      totalDistance: 0, 
      totalTime: 0, 
      averagePace: 0,
      totalActivities: 0
    };
    
    const totalDistance = filteredActivities.reduce((sum, activity) => sum + activity.distance, 0);
    const totalTime = filteredActivities.reduce((sum, activity) => sum + activity.duration, 0);
    const averagePace = totalTime / 60 / totalDistance;
    
    return {
      totalDistance: Math.round(totalDistance * 10) / 10,
      totalTime: Math.floor(totalTime / 60),
      averagePace: Math.round(averagePace * 100) / 100,
      totalActivities: filteredActivities.length
    };
  };
  
  const stats = calculateStats();
  
  const pieData = [
    { name: 'Zone 1', value: 10 },
    { name: 'Zone 2', value: 25 },
    { name: 'Zone 3', value: 40 },
    { name: 'Zone 4', value: 20 },
    { name: 'Zone 5', value: 5 }
  ];
  
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#FF8042'];
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  return (
    <div className="pb-10">
      <div className="flex flex-col mb-8">
        <div className="mb-5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Welcome back, {user.name}! Here's your activity summary.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={sportFilter}
                  onChange={(e) => setSportFilter(e.target.value as SportType)}
                  className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                >
                  {SPORT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                  <Filter size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {!user.isGarminConnected && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-600 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  To see your activity data, connect your Garmin account.
                  <a href="/connect-garmin" className="font-medium underline ml-1">
                    Connect now
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-start space-x-4 transform transition-all duration-300 hover:shadow-md">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Activities</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalActivities}</h3>
              <p className="text-green-500 dark:text-green-400 text-sm mt-1">+3 from last week</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-start space-x-4 transform transition-all duration-300 hover:shadow-md">
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Distance</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalDistance} km</h3>
              <p className="text-green-500 dark:text-green-400 text-sm mt-1">+5.2 km from last week</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-start space-x-4 transform transition-all duration-300 hover:shadow-md">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Time</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalTime} min</h3>
              <p className="text-green-500 dark:text-green-400 text-sm mt-1">+32 min from last week</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-start space-x-4 transform transition-all duration-300 hover:shadow-md">
            <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Avg Pace</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.averagePace} min/km</h3>
              <p className="text-orange-500 dark:text-orange-400 text-sm mt-1">+0.12 from last week</p>
            </div>
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Distance Over Time</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setTimeFilter('week')}
                  className={`px-3 py-1 text-xs rounded-md ${timeFilter === 'week' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  Week
                </button>
                <button 
                  onClick={() => setTimeFilter('month')}
                  className={`px-3 py-1 text-xs rounded-md ${timeFilter === 'month' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  Month
                </button>
                <button 
                  onClick={() => setTimeFilter('year')}
                  className={`px-3 py-1 text-xs rounded-md ${timeFilter === 'year' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  Year
                </button>
              </div>
            </div>
            
            <div className="h-72">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={timeFilter === 'week' ? weeklyDistance : monthlyDistance}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0077CC" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0077CC" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#6B7280' }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fill: '#6B7280' }} 
                      tickLine={false}
                      axisLine={false}
                      unit=" km"
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '6px' }}
                      formatter={(value) => [`${value} km`, 'Distance']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#0077CC" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorDistance)" 
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Heart Rate Zones</h3>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Last 30 days
              </div>
            </div>
            
            <div className="h-72">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Time in Zone']}
                      contentStyle={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '6px' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
        
        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activities</h3>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
              View All
            </button>
          </div>
          
          {loading ? (
            <div className="py-10 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Activity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Distance
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Duration
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Pace
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredActivities.slice(0, 5).map((activity) => (
                    <tr 
                      key={activity.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => navigate(`/activity/${activity.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {activity.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {activity.type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{activity.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{activity.distance} km</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {Math.floor(activity.duration / 60)}:{(activity.duration % 60).toString().padStart(2, '0')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {Math.floor(activity.averagePace)}:{Math.round((activity.averagePace % 1) * 60).toString().padStart(2, '0')} min/km
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;