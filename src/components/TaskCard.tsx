import type { Task, Status } from '../types';
import { CATEGORY_CONFIG, STATUS_CONFIG, PRIORITY_CONFIG } from '../constants';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Status) => void;
  readonly?: boolean;
}

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange, readonly }: TaskCardProps) => {
  const categoryConfig = CATEGORY_CONFIG[task.category];

  return (
    <div
      className={`
        border-l-4 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow
        ${categoryConfig.borderColor} ${categoryConfig.bgColor}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-sm font-medium ${categoryConfig.color}`}>
              {categoryConfig.label}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded ${PRIORITY_CONFIG[task.priority].color} bg-white`}>
              優先度: {PRIORITY_CONFIG[task.priority].label}
            </span>
            {task.timeSlot && (
              <span className="text-xs text-gray-600 bg-white px-2 py-0.5 rounded">
                {task.timeSlot}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-gray-900 mb-1 break-words">
            {task.title}
          </h3>

          {task.description && (
            <p className="text-sm text-gray-600 mb-2 whitespace-pre-wrap break-words">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-2">
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value as Status)}
              disabled={readonly}
              className={`
                text-xs px-2 py-1 rounded border
                ${STATUS_CONFIG[task.status].color}
                ${readonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer'}
              `}
            >
              <option value="not_started">{STATUS_CONFIG.not_started.label}</option>
              <option value="in_progress">{STATUS_CONFIG.in_progress.label}</option>
              <option value="completed">{STATUS_CONFIG.completed.label}</option>
              <option value="postponed">{STATUS_CONFIG.postponed.label}</option>
            </select>
          </div>
        </div>

        <div className="flex gap-1">
          {!readonly && (
            <>
              <button
                onClick={() => onEdit(task)}
                className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                編集
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                削除
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
