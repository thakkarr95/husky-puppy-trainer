export interface TrainingTask {
  id: string;
  title: string;
  description: string;
  category: 'Potty Training' | 'Crate Training' | 'Socialization' | 'Obedience' | 'Chewing/Biting';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
}

export interface FoodEntry {
  id: string;
  date: Date;
  puppyAgeWeeks: number;
  feedingTimes: {
    time: string;
    completed: boolean;
    amount?: number; // in cups
  }[];
  notes?: string;
}

export interface PottyEntry {
  id: string;
  date: Date;
  time: string;
  type: 'pee' | 'poop' | 'both';
  location: 'outside' | 'inside';
  context?: string; // e.g., "After breakfast", "After play"
  notes?: string;
}

export interface SleepEntry {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  quality?: 'excellent' | 'good' | 'fair' | 'poor';
  location?: 'crate' | 'bed' | 'couch' | 'other';
  puppyAgeWeeks: number;
  notes?: string;
}

export interface FeedingGuideline {
  ageWeeks: number;
  ageRange: string;
  mealsPerDay: number;
  cupsPerDay: number;
  cupsPerMeal: number;
  weightRange: string;
  notes: string[];
}

export interface DailyScheduleItem {
  id: string;
  time: string;
  activity: string;
  description: string;
  category: 'Feeding' | 'Potty' | 'Training' | 'Exercise' | 'Sleep' | 'Play';
  duration?: string;
  trainingTaskId?: string; // Reference to training task if applicable
  completed?: boolean;
}

export interface DailyTodoEntry {
  id: string;
  date: Date;
  items: {
    scheduleItemId: string;
    completed: boolean;
    completedAt?: Date;
    notes?: string;
  }[];
}

export interface WeeklyTask {
  week: number;
  title: string;
  description?: string;
  focusAreas?: string[];
  keyMilestones?: string[];
  tips?: string[];
  tasks: string[]; // Array of task IDs
}
