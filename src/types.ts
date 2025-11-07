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
  feedingTimes: {
    time: string;
    completed: boolean;
  }[];
}

export interface WeeklyTask {
  week: number;
  title: string;
  tasks: string[]; // Array of task IDs
}
