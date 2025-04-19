export interface User {
  id: string;
  email: string;
  name: string;
  isGarminConnected: boolean;
}

export interface Activity {
  id: string;
  type: SportType;
  name: string;
  date: string;
  distance: number;
  duration: number;
  averagePace: number;
  averageHeartRate: number | null;
  calories: number;
  elevationGain: number;
}

export interface ActivityDetails extends Activity {
  location: string;
  startTime: string;
  splits: Split[];
  heartRateZones?: HeartRateZone[];
  weatherConditions?: string;
  notes?: string;
}

export interface Split {
  distance: number;
  duration: number;
  pace: number;
  heartRate?: number;
  elevationChange?: number;
}

export interface HeartRateZone {
  zone: number;
  min: number;
  max: number;
  timeInZone: number;
  percentInZone: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface PeriodFilter {
  type: 'week' | 'month' | 'year' | 'custom';
  startDate?: Date;
  endDate?: Date;
}

export type SportType = 'Running' | 'Cycling' | 'Swimming' | 'Walking' | 'Hiking' | 'All';

export const SPORT_TYPES: SportType[] = ['All', 'Running', 'Cycling', 'Swimming', 'Walking', 'Hiking'];