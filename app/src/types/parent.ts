export interface ProgressStats {
  storiesRead: number;
  totalStories: number;
  quizzesPassed: number;
  totalQuizzes: number;
  screenTime: string;
}

export interface ParentSettings {
  notificationDays: string[];
  notificationTime: string;
  parentalControls: boolean;
}

export interface DashboardData {
  progress: ProgressStats;
  settings: ParentSettings;
}
