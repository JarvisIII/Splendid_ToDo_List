import { useState } from 'react';
import type { Task, FilterOptions, Status } from '../types';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { FilterBar } from './FilterBar';
import { canEditTask, getMonthDays, getWeekNumber, getWeekStart, getWeekEnd } from '../utils';

interface MonthlyViewProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

export const MonthlyView = ({ tasks, onAddTask, onUpdateTask, onDeleteTask }: MonthlyViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [filters, setFilters] = useState<FilterOptions>({});
  const [hideCompleted, setHideCompleted] = useState(false);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const monthDays = getMonthDays(selectedDate);
  const canEdit = canEditTask(selectedDate, 'monthly');

  // 選択した月のタスクを取得
  const monthlyTasks = tasks.filter((task) => {
    if (task.type !== 'monthly') return false;
    const taskDate = new Date(task.date);
    return taskDate.getFullYear() === year && taskDate.getMonth() === month;
  });

  // フィルター適用
  const filteredTasks = monthlyTasks.filter((task) => {
    if (filters.category && task.category !== filters.category) return false;
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (hideCompleted && task.status === 'completed') return false;
    return true;
  });

  // 週ごとにグループ化
  const weekGroups: { weekNumber: number; start: Date; end: Date; tasks: Task[] }[] = [];
  const processedWeeks = new Set<number>();

  monthDays.forEach((day) => {
    const weekNum = getWeekNumber(day);
    if (!processedWeeks.has(weekNum)) {
      processedWeeks.add(weekNum);
      const weekStart = getWeekStart(day);
      const weekEnd = getWeekEnd(day);
      const weekTasks = filteredTasks.filter((task) => task.weekNumber === weekNum);
      weekGroups.push({
        weekNumber: weekNum,
        start: weekStart,
        end: weekEnd,
        tasks: weekTasks,
      });
    }
  });

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

  const handleMonthChange = (months: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + months);
    setSelectedDate(newDate);
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">月間目標</h2>

        {/* 月選択 */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => handleMonthChange(-1)}
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          >
            前月
          </button>
          <div className="flex-1 text-center">
            <div className="text-xl font-semibold">
              {year}年{month + 1}月
            </div>
            {!canEdit && (
              <div className="text-sm text-orange-600 mt-1">
                参照のみ（編集不可）
              </div>
            )}
          </div>
          <button
            onClick={() => handleMonthChange(1)}
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          >
            翌月
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
            + 新しい目標を追加
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

      {/* タスク一覧（週ごと） */}
      <div className="space-y-4">
        {weekGroups.map((week) => (
          <div key={week.weekNumber} className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">
              第{week.weekNumber}週
              <span className="text-sm text-gray-600 ml-2">
                ({week.start.getMonth() + 1}/{week.start.getDate()} 〜{' '}
                {week.end.getMonth() + 1}/{week.end.getDate()})
              </span>
            </h3>

            {week.tasks.length > 0 ? (
              <div className="space-y-3">
                {week.tasks.map((task) => (
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
              <p className="text-sm text-gray-500">目標なし</p>
            )}
          </div>
        ))}

        {weekGroups.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            この月にはタスクがありません
          </div>
        )}
      </div>

      {/* タスクフォーム */}
      {showForm && (
        <TaskForm
          task={editingTask}
          initialDate={selectedDate}
          initialType="monthly"
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
