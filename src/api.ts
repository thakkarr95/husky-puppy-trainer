import type { TrainingTask, FoodEntry, PottyEntry, SleepEntry, DailyTodoEntry } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper function for API calls
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

// ===== TRAINING TASKS API =====

export async function getTrainingTasks(): Promise<Record<number, TrainingTask[]>> {
  return apiCall('/api/training-tasks');
}

export async function saveTrainingTasks(tasks: Record<number, TrainingTask[]>): Promise<void> {
  await apiCall('/api/training-tasks', {
    method: 'POST',
    body: JSON.stringify(tasks),
  });
}

// ===== FOOD ENTRIES API =====

export async function getFoodEntries(): Promise<FoodEntry[]> {
  const entries = await apiCall<any[]>('/api/food-entries');
  // Convert date strings back to Date objects
  return entries.map(entry => ({
    ...entry,
    date: new Date(entry.date),
  }));
}

export async function addFoodEntry(entry: FoodEntry): Promise<void> {
  await apiCall('/api/food-entries', {
    method: 'POST',
    body: JSON.stringify(entry),
  });
}

export async function updateFoodEntry(entry: FoodEntry): Promise<void> {
  await apiCall(`/api/food-entries/${entry.id}`, {
    method: 'PUT',
    body: JSON.stringify(entry),
  });
}

// ===== POTTY ENTRIES API =====

export async function getPottyEntries(): Promise<PottyEntry[]> {
  const entries = await apiCall<any[]>('/api/potty-entries');
  // Convert date strings back to Date objects
  return entries.map(entry => ({
    ...entry,
    date: new Date(entry.date),
  }));
}

export async function addPottyEntry(entry: PottyEntry): Promise<void> {
  await apiCall('/api/potty-entries', {
    method: 'POST',
    body: JSON.stringify(entry),
  });
}

export async function deletePottyEntry(id: string): Promise<void> {
  await apiCall(`/api/potty-entries/${id}`, {
    method: 'DELETE',
  });
}

export async function deleteFoodEntry(id: string): Promise<void> {
  await apiCall(`/api/food-entries/${id}`, {
    method: 'DELETE',
  });
}

// ===== SLEEP ENTRIES API =====

export async function getSleepEntries(): Promise<SleepEntry[]> {
  const entries = await apiCall<any[]>('/api/sleep-entries');
  // Convert date strings back to Date objects
  return entries.map(entry => ({
    ...entry,
    date: new Date(entry.date),
  }));
}

export async function addSleepEntry(entry: SleepEntry): Promise<void> {
  await apiCall('/api/sleep-entries', {
    method: 'POST',
    body: JSON.stringify(entry),
  });
}

export async function updateSleepEntry(entry: SleepEntry): Promise<void> {
  await apiCall(`/api/sleep-entries/${entry.id}`, {
    method: 'PUT',
    body: JSON.stringify(entry),
  });
}

export async function deleteSleepEntry(id: string): Promise<void> {
  await apiCall(`/api/sleep-entries/${id}`, {
    method: 'DELETE',
  });
}

// ===== TODO ENTRIES API =====

export async function getTodoEntries(): Promise<DailyTodoEntry[]> {
  return apiCall('/api/todo-entries');
}

export async function saveTodoEntry(entry: DailyTodoEntry): Promise<void> {
  await apiCall('/api/todo-entries', {
    method: 'POST',
    body: JSON.stringify(entry),
  });
}

// ===== PUPPY INFO API =====

export async function getPuppyInfo(): Promise<{ birthDate?: string }> {
  return apiCall('/api/puppy-info');
}

export async function savePuppyInfo(info: { birthDate: string }): Promise<void> {
  await apiCall('/api/puppy-info', {
    method: 'POST',
    body: JSON.stringify(info),
  });
}

// ===== SYNC API =====

export interface SyncData {
  trainingTasks: Record<number, TrainingTask[]>;
  foodEntries: FoodEntry[];
  pottyEntries: PottyEntry[];
  sleepEntries: SleepEntry[];
  puppyInfo: { birthDate?: string };
  todoEntries: DailyTodoEntry[];
}

export async function syncAllData(): Promise<SyncData> {
  const data = await apiCall<any>('/api/sync');
  
  // Convert date strings back to Date objects
  return {
    trainingTasks: data.trainingTasks,
    foodEntries: data.foodEntries.map((entry: any) => ({
      ...entry,
      date: new Date(entry.date),
    })),
    pottyEntries: data.pottyEntries.map((entry: any) => ({
      ...entry,
      date: new Date(entry.date),
    })),
    sleepEntries: (data.sleepEntries || []).map((entry: any) => ({
      ...entry,
      date: new Date(entry.date),
    })),
    puppyInfo: data.puppyInfo,
    todoEntries: data.todoEntries || [],
  };
}

// ===== HEALTH CHECK =====

export async function checkHealth(): Promise<{ status: string; timestamp: string }> {
  return apiCall('/api/health');
}
