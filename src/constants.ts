import type { Category, Status, Priority, CategoryConfig, StatusConfig, PriorityConfig, TimeSlot } from './types';

// カテゴリー設定
export const CATEGORY_CONFIG: Record<Category, CategoryConfig> = {
  personal: {
    label: '私生活',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
  },
  hobby: {
    label: '趣味',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
  },
  work: {
    label: '仕事',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
  },
  certification: {
    label: '資格',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
  },
};

// ステータス設定
export const STATUS_CONFIG: Record<Status, StatusConfig> = {
  not_started: {
    label: '未着手',
    color: 'text-gray-600',
  },
  in_progress: {
    label: '進行中',
    color: 'text-blue-600',
  },
  completed: {
    label: '完了',
    color: 'text-green-600',
  },
  postponed: {
    label: '延期',
    color: 'text-orange-600',
  },
};

// 優先度設定
export const PRIORITY_CONFIG: Record<Priority, PriorityConfig> = {
  high: {
    label: '高',
    color: 'text-red-600',
  },
  medium: {
    label: '中',
    color: 'text-yellow-600',
  },
  low: {
    label: '低',
    color: 'text-gray-600',
  },
};

// 時間枠リスト
export const TIME_SLOTS: TimeSlot[] = [
  '06:00-08:00',
  '08:00-10:00',
  '10:00-12:00',
  '12:00-14:00',
  '14:00-16:00',
  '16:00-18:00',
  '18:00-20:00',
  '20:00-22:00',
];

// 曜日
export const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
