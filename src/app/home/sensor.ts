export interface Sensor {
  id: string;
  imei: string;
  name: string;
  category: string;
  active: boolean;
}

export interface SensorSummary {
  total: number;
  active: number;
  inactive: number;
  soil: number;
  soilActive: number;
  soilInactive: number;
  weather: number;
  weatherActive: number;
  weatherInactive: number;
}
