export interface Project {
  id: string;
  name: string;
  percentage: number;
  timeValue: number;
  isFrozen: boolean;
}

export interface Theme {
  id: string;
  name: string;
  percentage: number;
  timeValue: number;
  isFrozen: boolean;
  projects: Project[];
  color: string;
}

export interface AppState {
  totalTime: number;
  themes: Theme[];
}