import { useState } from 'react';
import type { Task, FilterOptions, Status } from '../types';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { FilterBar } from './FilterBar';

interface MatrixViewProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

export const MatrixView = ({ tasks, onAddTask, onUpdateTask, onDeleteTask }: MatrixViewProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [filters, setFilters] = useState<FilterOptions>({});
  const [hideCompleted, setHideCompleted] = useState(false);

  // 緊急度を判定（期限まで3日以内なら緊急）
  const isUrgent = (task: Task): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(task.date);
    const daysUntil = Math.ceil((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 3;
  };

  // フィルター適用
  const filteredTasks = tasks.filter((task) => {
    if (filters.category && task.category !== filters.category) return false;
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (hideCompleted && task.status === 'completed') return false;
    return true;
  });

  // 4象限に分類
  const importantUrgent = filteredTasks.filter(
    (task) => task.priority === 'high' && isUrgent(task)
  );
  const importantNotUrgent = filteredTasks.filter(
    (task) => task.priority === 'high' && !isUrgent(task)
  );
  const notImportantUrgent = filteredTasks.filter(
    (task) => (task.priority === 'medium' || task.priority === 'low') && isUrgent(task)
  );
  const notImportantNotUrgent = filteredTasks.filter(
    (task) => (task.priority === 'medium' || task.priority === 'low') && !isUrgent(task)
  );

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

    // ステータスを「遅延」に変更した場合、編集メニューを自動表示
    if (status === 'postponed') {
      const task = tasks.find(t => t.id === id);
      if (task) {
        handleEdit(task);
      }
    }
  };

  const QuadrantCard = ({ title, color, tasks: quadrantTasks, description }: {
    title: string;
    color: string;
    tasks: Task[];
    description: string;
  }) => (
    <div className={`${color} rounded-lg shadow p-4 h-full`}>
      <div className="mb-3 border-b pb-2">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-xs text-gray-600 mt-1">{description}</p>
        <span className="text-sm font-medium text-gray-700 mt-1 block">
          {quadrantTasks.length}件のタスク
        </span>
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {quadrantTasks.length > 0 ? (
          quadrantTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={onDeleteTask}
              onStatusChange={handleStatusChange}
              readonly={false}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">タスクなし</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-2">総評</h2>
        <p className="text-sm text-gray-600">
          全タスクを重要度×緊急度で分類（緊急 = 期限まで3日以内）
        </p>
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

      {/* マトリクス */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 第1象限：重要かつ緊急 */}
        <QuadrantCard
          title="🔴 重要 ＆ 緊急"
          color="bg-red-50 border-2 border-red-300"
          tasks={importantUrgent}
          description="今すぐ実行"
        />

        {/* 第2象限：重要だが緊急でない */}
        <QuadrantCard
          title="🟢 重要 ＆ 緊急でない"
          color="bg-green-50 border-2 border-green-300"
          tasks={importantNotUrgent}
          description="計画して実行"
        />

        {/* 第3象限：重要でないが緊急 */}
        <QuadrantCard
          title="🟡 重要でない ＆ 緊急"
          color="bg-yellow-50 border-2 border-yellow-300"
          tasks={notImportantUrgent}
          description="委任を検討"
        />

        {/* 第4象限：重要でも緊急でもない */}
        <QuadrantCard
          title="⚪ 重要でない ＆ 緊急でない"
          color="bg-gray-50 border-2 border-gray-300"
          tasks={notImportantNotUrgent}
          description="削除を検討"
        />
      </div>

      {/* タスクフォーム */}
      {showForm && (
        <TaskForm
          task={editingTask}
          initialDate={new Date()}
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
