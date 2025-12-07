import { useState } from 'react';
import type { Task, FilterOptions, Status } from '../types';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { FilterBar } from './FilterBar';
import { formatDate, formatDateDisplay, canEditTask, getWeekDays, getWeekNumber } from '../utils';
import { addDays } from 'date-fns';
import { WEEKDAYS } from '../constants';

interface WeeklyViewProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

export const WeeklyView = ({ tasks, onAddTask, onUpdateTask, onDeleteTask }: WeeklyViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [filters, setFilters] = useState<FilterOptions>({});
  const [hideCompleted, setHideCompleted] = useState(false);

  const weekDays = getWeekDays(selectedDate);
  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];
  const canEdit = canEditTask(selectedDate, 'weekly');

  // 選択した週のタスクを取得
  const weeklyTasks = tasks.filter((task) => {
    if (task.type !== 'weekly') return false;
    const taskDate = new Date(task.date);
    const taskWeekDays = getWeekDays(taskDate);
    return formatDate(taskWeekDays[0]) === formatDate(weekStart);
  });

  // フィルター適用
  const filteredTasks = weeklyTasks.filter((task) => {
    if (filters.category && task.category !== filters.category) return false;
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (hideCompleted && task.status === 'completed') return false;
    return true;
  });

  // 日付ごとにタスクをグループ化
  const tasksByDate = weekDays.reduce((acc, day) => {
    const dateString = formatDate(day);
    acc[dateString] = filteredTasks.filter((task) => task.date === dateString);
    return acc;
  }, {} as Record<string, Task[]>);

  const handleSubmit = (task: Task) => {
    if (editingTask) {
      onUpdateTask(task.id, task);
    } else {
      onAddTask(task);
    }
    setShowForm(false);
    setEditingTask(undefined);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleStatusChange = (id: string, status: Status) => {
    onUpdateTask(id, { status });
  };

  const handleWeekChange = (weeks: number) => {
    const newDate = addDays(selectedDate, weeks * 7);
    setSelectedDate(newDate);
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">週間予定</h2>

        {/* 週選択 */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => handleWeekChange(-1)}
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          >
            前週
          </button>
          <div className="flex-1 text-center">
            <div className="text-xl font-semibold">
              {formatDateDisplay(weekStart)} 〜 {formatDateDisplay(weekEnd)}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {getWeekNumber(selectedDate)}週目
            </div>
            {!canEdit && (
              <div className="text-sm text-orange-600 mt-1">
                参照のみ（編集不可）
              </div>
            )}
          </div>
          <button
            onClick={() => handleWeekChange(1)}
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          >
            翌週
          </button>
        </div>

        {/* 新規作成ボタン */}
        {canEdit && (
          <button
            onClick={() => {
              setEditingTask(undefined);
              setShowForm(true);
            }}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            + 新しい予定を追加
          </button>
        )}
      </div>

      {/* フィルター */}
      <FilterBar filters={filters} onFilterChange={setFilters} />

      {/* 完了タスク表示切り替え */}
      <div className="bg-white rounded-lg shadow p-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hideCompleted}
            onChange={(e) => setHideCompleted(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">完了済みを非表示</span>
        </label>
      </div>

      {/* タスク一覧（日付ごと） */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const dateString = formatDate(day);
          const dayTasks = tasksByDate[dateString] || [];
          const dayOfWeek = WEEKDAYS[(index + 1) % 7]; // 月曜始まりなので調整

          return (
            <div key={dateString} className="bg-white rounded-lg shadow p-4">
              <div className="mb-3 border-b pb-2">
                <div className="font-semibold text-gray-900">{dayOfWeek}</div>
                <div className="text-sm text-gray-600">
                  {day.getMonth() + 1}/{day.getDate()}
                </div>
              </div>

              {dayTasks.length > 0 ? (
                <div className="space-y-2">
                  {dayTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEdit}
                      onDelete={onDeleteTask}
                      onStatusChange={handleStatusChange}
                      readonly={!canEdit}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">予定なし</p>
              )}
            </div>
          );
        })}
      </div>

      {/* タスクフォーム */}
      {showForm && (
        <TaskForm
          task={editingTask}
          initialDate={weekStart}
          initialType="weekly"
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(undefined);
          }}
        />
      )}
    </div>
  );
};
