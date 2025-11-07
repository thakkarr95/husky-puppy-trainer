import type { TrainingTask } from '../types';

interface TaskCardProps {
  task: TrainingTask;
  onCompletionChange: (taskId: string, completed: boolean) => void;
}

const TaskCard = ({ task, onCompletionChange }: TaskCardProps) => {
  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-header">
        <div className="task-info">
          <span className="category-badge">{task.category}</span>
          <span className="difficulty-badge">{task.difficulty}</span>
        </div>
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed}
          onChange={(e) => onCompletionChange(task.id, e.target.checked)}
        />
      </div>
      <h3 className="task-title">{task.title}</h3>
      <p className="task-description">{task.description}</p>
    </div>
  );
};

export default TaskCard;
