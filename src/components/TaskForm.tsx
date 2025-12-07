import { useState, useEffect } from 'react';
import type { Task, Category, Priority, TaskType, TimeSlot } from '../types';
import { CATEGORY_CONFIG, PRIORITY_CONFIG, TIME_SLOTS } from '../constants';
import { formatDate, generateId, getWeekNumber } from '../utils';

interface TaskFormProps {
  task?: Task;
  initialDate?: Date;
  initialType?: TaskType;
  onSubmit: (task: Task) => void;
  onCancel: () => void;
}

export const TaskForm = ({ task, initialDate, initialType, onSubmit, onCancel }: TaskFormProps) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [category, setCategory] = useState<Category>(task?.category || 'personal');
  const [priority, setPriority] = useState<Priority>(task?.priority || 'medium');
  const [type, setType] = useState<TaskType>(task?.type || initialType || 'daily');
  const [date, setDate] = useState(task?.date || (initialDate ? formatDate(initialDate) : ''));
  const [timeSlot, setTimeSlot] = useState<TimeSlot | ''>(task?.timeSlot || '');
  const [isAllDay, setIsAllDay] = useState(false);
  const [previousType, setPreviousType] = useState<TaskType>(task?.type || initialType || 'daily');

  // 終日選択時に自動的に週間予定に変更
  useEffect(() => {
    if (isAllDay) {
      // 終日にチェックが入ったら、現在のタイプを保存して週間予定に変更
      if (type !== 'weekly') {
        setPreviousType(type);
        setType('weekly');
      }
      setTimeSlot(''); // 時間枠をクリア
    } else if (previousType !== type && type === 'weekly') {
      // 終日のチェックを外したら、以前のタイプに戻す
      setType(previousType);
    }
  }, [isAllDay, type, previousType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !date) {
      alert('タイトルと日付は必須です');
      return;
    }

    const now = new Date().toISOString();
    const taskDate = new Date(date);
    const weekNumber = getWeekNumber(taskDate);

    const newTask: Task = {
      id: task?.id || generateId(),
      title: title.trim(),
      description: description.trim(),
      category,
      status: task?.status || 'not_started',
      priority,
      type,
      date,
      timeSlot: type === 'daily' && timeSlot ? timeSlot : undefined,
      weekNumber: type === 'weekly' || type === 'monthly' ? weekNumber : undefined,
      createdAt: task?.createdAt || now,
      updatedAt: now,
    };

    onSubmit(newTask);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">
            {task ? 'タスクを編集' : 'タスクを作成'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* タイトル */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="タスクのタイトルを入力"
                required
              />
            </div>

            {/* 説明 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                説明
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="タスクの詳細を入力"
                rows={3}
              />
            </div>

            {/* カテゴリー */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                カテゴリー <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(Object.keys(CATEGORY_CONFIG) as Category[]).map((cat) => {
                  const config = CATEGORY_CONFIG[cat];
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`
                        px-4 py-2 rounded-md border-2 transition-all
                        ${category === cat
                          ? `${config.borderColor} ${config.bgColor} ${config.color}`
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 優先度 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                優先度 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((pri) => {
                  const config = PRIORITY_CONFIG[pri];
                  return (
                    <button
                      key={pri}
                      type="button"
                      onClick={() => setPriority(pri)}
                      className={`
                        px-4 py-2 rounded-md border-2 transition-all
                        ${priority === pri
                          ? `border-gray-800 bg-gray-100 ${config.color}`
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 終日オプション */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAllDay}
                  onChange={(e) => setIsAllDay(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  終日（週間予定として登録）
                </span>
              </label>
            </div>

            {/* タスクタイプ */}
            {!isAllDay && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  タスクタイプ <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setType('daily')}
                    className={`
                      px-4 py-2 rounded-md border-2 transition-all
                      ${type === 'daily' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}
                    `}
                  >
                    当日予定
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('weekly')}
                    className={`
                      px-4 py-2 rounded-md border-2 transition-all
                      ${type === 'weekly' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}
                    `}
                  >
                    週間予定
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('monthly')}
                    className={`
                      px-4 py-2 rounded-md border-2 transition-all
                      ${type === 'monthly' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}
                    `}
                  >
                    月間目標
                  </button>
                </div>
              </div>
            )}

            {/* 日付 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                日付 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={formatDate(new Date())}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* 時間枠（当日予定のみ） */}
            {!isAllDay && type === 'daily' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  時間枠
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value as TimeSlot)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">未設定</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* ボタン */}
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {task ? '更新' : '作成'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
