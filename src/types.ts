// カテゴリー（目標区分）
export type Category = 'personal' | 'hobby' | 'work' | 'certification';

// ステータス
export type Status = 'not_started' | 'in_progress' | 'completed' | 'postponed';

// 優先度
export type Priority = 'high' | 'medium' | 'low';

// タスクタイプ
export type TaskType = 'daily' | 'weekly' | 'monthly';

// 時間枠（当日予定用）- 6:00-22:00を2時間単位
export type TimeSlot =
  | '06:00-08:00'
  | '08:00-10:00'
  | '10:00-12:00'
  | '12:00-14:00'
  | '14:00-16:00'
  | '16:00-18:00'
  | '18:00-20:00'
  | '20:00-22:00';

// タスク
export interface Task {
  id: string;
  title: string;
  description: string;
  category: Category;
  status: Status;
  priority: Priority;
  type: TaskType;
  date: string; // YYYY-MM-DD形式
  timeSlot?: TimeSlot; // 当日予定の場合のみ
  weekNumber?: number; // 週間・月間予定の場合（ISO週番号）
  createdAt: string; // ISO 8601形式
  updatedAt: string; // ISO 8601形式
}

// フィルター条件
export interface FilterOptions {
  category?: Category;
  status?: Status;
  priority?: Priority;
  type?: TaskType;
}

// カテゴリー設定
export interface CategoryConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

// ステータス設定
export interface StatusConfig {
  label: string;
  color: string;
}

// 優先度設定
export interface PriorityConfig {
  label: string;
  color: string;
}
