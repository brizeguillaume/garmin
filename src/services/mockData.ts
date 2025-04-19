import { Activity, ActivityDetails, ChartData, SportType } from '../types';
import { format, subDays, addMinutes } from 'date-fns';

const SPORT_TYPES: SportType[] = ['Running', 'Cycling', 'Swimming', 'Walking', 'Hiking'];

// Generate a set of mock running activities
export const generateMockActivities = (): Activity[] => {
  const activities: Activity[] = [];
  
  for (let i = 0; i < 15; i++) {
    const date = subDays(new Date(), i);
    const type = SPORT_TYPES[Math.floor(Math.random() * SPORT_TYPES.length)];
    const distance = Math.round((3 + Math.random() * 12) * 100) / 100; // 3-15km
    const duration = Math.round((distance * (5 + Math.random() * 2)) * 60); // 5-7 min/km pace in seconds
    const averagePace = Math.round((duration / 60) / distance * 100) / 100; // min/km
    const heartRate = Math.round(140 + Math.random() * 30); // 140-170 bpm
    
    activities.push({
      id: `activity-${i}`,
      type,
      name: `${type} ${i % 3 === 0 ? 'in the Park' : i % 3 === 1 ? 'along the River' : 'around Town'}`,
      date: format(date, 'yyyy-MM-dd'),
      distance,
      duration,
      averagePace,
      averageHeartRate: heartRate,
      calories: Math.round(distance * 60 + Math.random() * 100),
      elevationGain: Math.round(distance * (10 + Math.random() * 50))
    });
  }
  
  return activities;
};

// Generate mock activity details
export const generateMockActivityDetails = (activityId: string): ActivityDetails => {
  const activities = generateMockActivities();
  const activity = activities.find(a => a.id === activityId) || activities[0];
  
  const startTime = new Date();
  startTime.setHours(7);
  startTime.setMinutes(Math.floor(Math.random() * 30));
  
  const splits = [];
  const totalKm = Math.floor(activity.distance);
  
  for (let i = 0; i < totalKm; i++) {
    const splitPace = activity.averagePace + (Math.random() * 0.6 - 0.3); // Variation in pace
    const splitDuration = Math.round(splitPace * 60); // Seconds
    const splitHeartRate = Math.round(activity.averageHeartRate! + (Math.random() * 10 - 5));
    
    splits.push({
      distance: 1,
      duration: splitDuration,
      pace: splitPace,
      heartRate: splitHeartRate,
      elevationChange: Math.round((Math.random() * 40) - 20) // -20 to +20m
    });
  }
  
  // Add the last partial km if the distance isn't an integer
  if (activity.distance > totalKm) {
    const remainingDistance = activity.distance - totalKm;
    const splitPace = activity.averagePace + (Math.random() * 0.6 - 0.3);
    const splitDuration = Math.round(splitPace * 60 * remainingDistance);
    const splitHeartRate = Math.round(activity.averageHeartRate! + (Math.random() * 10 - 5));
    
    splits.push({
      distance: remainingDistance,
      duration: splitDuration,
      pace: splitPace,
      heartRate: splitHeartRate,
      elevationChange: Math.round((Math.random() * 40) - 20)
    });
  }
  
  // Heart rate zones
  const heartRateZones = [
    { zone: 1, min: 100, max: 120, timeInZone: Math.round(activity.duration * 0.1), percentInZone: 10 },
    { zone: 2, min: 121, max: 140, timeInZone: Math.round(activity.duration * 0.2), percentInZone: 20 },
    { zone: 3, min: 141, max: 160, timeInZone: Math.round(activity.duration * 0.4), percentInZone: 40 },
    { zone: 4, min: 161, max: 180, timeInZone: Math.round(activity.duration * 0.2), percentInZone: 20 },
    { zone: 5, min: 181, max: 200, timeInZone: Math.round(activity.duration * 0.1), percentInZone: 10 }
  ];
  
  return {
    ...activity,
    location: activity.name.includes('Park') ? 'City Park' : activity.name.includes('River') ? 'River Path' : 'Urban Route',
    startTime: format(startTime, 'HH:mm:ss'),
    splits,
    heartRateZones,
    weatherConditions: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
    notes: Math.random() > 0.5 ? 'Felt strong today. Good rhythm throughout the run.' : undefined
  };
};

// Generate stats by week
export const generateWeeklyStats = (sportType: SportType = 'All'): ChartData[] => {
  const data: ChartData[] = [];
  
  for (let i = 4; i >= 0; i--) {
    const weekStart = format(subDays(new Date(), i * 7 + 6), 'MMM d');
    const weekEnd = format(subDays(new Date(), i * 7), 'MMM d');
    const weekName = `${weekStart}-${weekEnd}`;
    
    data.push({
      name: weekName,
      value: Math.round((15 + Math.random() * 20) * 10) / 10
    });
  }
  
  return data;
};

// Generate stats by month
export const generateMonthlyStats = (sportType: SportType = 'All'): ChartData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  const data: ChartData[] = [];
  
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    
    data.push({
      name: months[monthIndex],
      value: Math.round((40 + Math.random() * 50) * 10) / 10
    });
  }
  
  return data;
};