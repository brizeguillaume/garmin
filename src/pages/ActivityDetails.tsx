import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { 
  Calendar,
  Clock,
  TrendingUp,
  Navigation,
  Heart,
  Flame,
  ArrowLeft,
  Map as MapIcon,
  ChevronUp,
  Share2,
  Download
} from 'lucide-react';
import { generateMockActivityDetails } from '../services/mockData';
import { ActivityDetails as ActivityDetailsType, Split } from '../types';

const ActivityDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<ActivityDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      const activityDetails = generateMockActivityDetails(id);
      setActivity(activityDetails);
      setLoading(false);
    }, 800);
  }, [id]);
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!activity) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Activity not found</h2>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  // Prepare data for pace chart
  const paceData = activity.splits.map((split, index) => ({
    km: index + 1,
    pace: split.pace,
    heartRate: split.heartRate
  }));
  
  // Prepare data for elevation chart
  const elevationData = activity.splits.map((split, index) => ({
    km: index + 1,
    elevation: split.elevationChange
  }));
  
  return (
    <div className="pb-10">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="mr-3 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{activity.name}</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {activity.date} • {activity.location}
          </p>
        </div>
        <div className="ml-auto flex space-x-2">
          <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <Share2 size={18} className="text-gray-700 dark:text-gray-300" />
          </button>
          <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <Download size={18} className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center transform transition-all duration-300 hover:shadow-md">
          <div className="flex justify-center mb-1">
            <TrendingUp size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Distance</p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">{activity.distance} km</h3>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center transform transition-all duration-300 hover:shadow-md">
          <div className="flex justify-center mb-1">
            <Clock size={20} className="text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
            {Math.floor(activity.duration / 60)}:{(activity.duration % 60).toString().padStart(2, '0')}
          </h3>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center transform transition-all duration-300 hover:shadow-md">
          <div className="flex justify-center mb-1">
            <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Avg Pace</p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
            {Math.floor(activity.averagePace)}:{Math.round((activity.averagePace % 1) * 60).toString().padStart(2, '0')}
          </h3>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center transform transition-all duration-300 hover:shadow-md">
          <div className="flex justify-center mb-1">
            <Heart size={20} className="text-red-600 dark:text-red-400" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Avg HR</p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
            {activity.averageHeartRate} bpm
          </h3>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center transform transition-all duration-300 hover:shadow-md">
          <div className="flex justify-center mb-1">
            <Flame size={20} className="text-orange-600 dark:text-orange-400" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Calories</p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
            {activity.calories}
          </h3>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center transform transition-all duration-300 hover:shadow-md">
          <div className="flex justify-center mb-1">
            <ChevronUp size={20} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Elevation</p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
            {activity.elevationGain}m
          </h3>
        </div>
      </div>
      
      {/* Map Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8 overflow-hidden transform transition-all duration-300 hover:shadow-md">
        <div className="relative overflow-hidden aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <div className="text-center p-10">
            <MapIcon size={56} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              Map data would be displayed here in a real implementation
            </p>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Pace & Heart Rate</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={paceData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="km" 
                  tick={{ fill: '#6B7280' }}
                  tickLine={false}
                  label={{ value: 'Distance (km)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fill: '#6B7280' }} 
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 0.5', 'dataMax + 0.5']}
                  label={{ value: 'Pace (min/km)', angle: -90, position: 'insideLeft' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#6B7280' }} 
                  tickLine={false}
                  axisLine={false}
                  domain={[80, 'dataMax + 20']}
                  label={{ value: 'Heart Rate (bpm)', angle: 90, position: 'insideRight' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '6px' }}
                  formatter={(value, name) => [
                    name === 'pace' 
                      ? `${Math.floor(value as number)}:${Math.round(((value as number) % 1) * 60).toString().padStart(2, '0')} min/km` 
                      : `${value} bpm`,
                    name === 'pace' ? 'Pace' : 'Heart Rate'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="pace" 
                  stroke="#0077CC" 
                  yAxisId="left"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="heartRate" 
                  stroke="#EF4444" 
                  yAxisId="right"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Elevation Profile</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={elevationData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="km" 
                  tick={{ fill: '#6B7280' }}
                  tickLine={false}
                  label={{ value: 'Distance (km)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  tick={{ fill: '#6B7280' }} 
                  tickLine={false}
                  axisLine={false}
                  label={{ value: 'Elevation Change (m)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '6px' }}
                  formatter={(value) => [`${value} m`, 'Elevation Change']}
                />
                <Bar 
                  dataKey="elevation" 
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Splits Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 transform transition-all duration-300 hover:shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Splits</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Split
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Distance
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Pace
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Heart Rate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Elevation
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {activity.splits.map((split, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{split.distance} km</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {Math.floor(split.duration / 60)}:{(split.duration % 60).toString().padStart(2, '0')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {Math.floor(split.pace)}:{Math.round((split.pace % 1) * 60).toString().padStart(2, '0')} min/km
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {split.heartRate} bpm
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${split.elevationChange! > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {split.elevationChange! > 0 ? '+' : ''}{split.elevationChange} m
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Heart Rate Zones */}
      {activity.heartRateZones && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Heart Rate Zones</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {activity.heartRateZones.map((zone) => (
              <div key={zone.zone} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Zone {zone.zone}</div>
                <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{zone.percentInZone}%</div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{zone.min}-{zone.max} bpm</div>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${zone.percentInZone}%` }}
                  ></div>
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {Math.floor(zone.timeInZone / 60)}:{(zone.timeInZone % 60).toString().padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityDetails;