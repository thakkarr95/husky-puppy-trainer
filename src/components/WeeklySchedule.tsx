import type { TrainingTask } from '../types';
import TaskCard from './TaskCard';

interface WeeklyScheduleProps {
  tasks: TrainingTask[];
  onTasksUpdate: (tasks: TrainingTask[]) => void;
}

const WeeklySchedule = ({ tasks, onTasksUpdate }: WeeklyScheduleProps) => {
  const handleTaskCompletion = (taskId: string, completed: boolean) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed } : task
    );
    onTasksUpdate(updatedTasks);
  };

  return (
    <div>
      {/* We will add the weekly schedule UI here later */}
      <div className="tasks-grid">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onCompletionChange={handleTaskCompletion}
          />
        ))}
      </div>
    </div>
  );
};

export default WeeklySchedule;
