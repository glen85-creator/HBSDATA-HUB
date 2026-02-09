
export enum NavTab {
  Dashboard = 'dashboard',
  MapStrategy = 'map',
  StoreAnalysis = 'analysis',
  DataBlackhole = 'blackhole',
  Settings = 'settings'
}

export interface StoreData {
  id: string;
  name: string;
  region: string;
  brand: string;
  sales: number;
  growth: number;
  traffic: number;
}

export interface Announcement {
  id: string;
  agency: string;
  title: string;
  date: string;
  type: 'tender' | 'notice';
}
