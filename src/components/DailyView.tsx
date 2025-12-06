import { useState } from 'react';
import type { Task, FilterOptions, Status } from '../types';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { FilterBar } from './FilterBar';
import { formatDate, formatDateDisplay, canEditTask } from '../utils';
import { TIME_SLOTS } from '../constants';

interface DailyViewProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

export const DailyView = ({ tasks, onAddTask, onUpdateTask, onDeleteTask }: DailyViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [filters, setFilters] = useState<FilterOptions>({});

  const dateString = formatDate(selectedDate);
  const canEdit = canEditTask(selectedDate, 'daily');

  // 選択した日付のタスクを取得
  const dailyTasks = tasks.filter(
    (task) => task.type === 'daily' && task.date === dateString
  );

  // フィルター適用
  const filteredTasks = dailyTasks.filter((task) => {
    if (filters.category && task.category !== filters.category) return false;
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    return true;
  });

  // 時間枠ごとにタスクをグループ化
  const tasksByTimeSlot = TIME_SLOTS.reduce((acc, slot) => {
    acc[slot] = filteredTasks.filter((task) => task.timeSlot === slot);
    return acc;
  }, {} as Record<string, Task[]>);

  // 時間枠未設定のタスク
  const unscheduledTasks = filteredTasks.filter((task) => !task.timeSlot);

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

  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">当日予定</h2>

        {/* 日付選択 */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => handleDateChange(-1)}
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          >
            前日
          </button>
          <div className="flex-1 text-center">
            <div className="text-xl font-semibold">{formatDateDisplay(selectedDate)}</div>
            {!canEdit && (
              <div className="text-sm text-orange-600 mt-1">
                参照のみ（編集不可）
              </div>
            )}
          </div>
          <button
            onClick={() => handleDateChange(1)}
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          >
            翌日
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

      {/* タスク一覧（時間枠ごと） */}
      <div className="space-y-6">
        {TIME_SLOTS.map((slot) => {
          const slotTasks = tasksByTimeSlot[slot];
          return (
            <div key={slot} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">
                {slot}
              </h3>
              {slotTasks.length > 0 ? (
                <div className="space-y-3">
                  {slotTasks.map((task) => (
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
                <p className="text-sm text-gray-500">予定なし</p>
              )}
            </div>
          );
        })}

        {/* 時間枠未設定のタスク */}
        {unscheduledTasks.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">
              時間枠未設定
            </h3>
            <div className="space-y-3">
              {unscheduledTasks.map((task) => (
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
          </div>
        )}
      </div>

      {/* タスクフォーム */}
      {showForm && (
        <TaskForm
          task={editingTask}
          initialDate={selectedDate}
          initialType="daily"
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
