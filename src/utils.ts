import {
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  getISOWeek,
  getYear,
  addDays,
  isBefore,
  isAfter,
  isSameDay,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import type { TaskType } from './types';

/**
 * 日付をYYYY-MM-DD形式にフォーマット
 */
export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * 日付を表示用にフォーマット（例: 2025年12月7日（土））
 */
export const formatDateDisplay = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy年M月d日(E)', { locale: ja });
};

/**
 * ISO週番号を取得
 */
export const getWeekNumber = (date: Date): number => {
  return getISOWeek(date);
};

/**
 * 指定日の週の開始日（月曜日）を取得
 */
export const getWeekStart = (date: Date): Date => {
  return startOfWeek(date, { weekStartsOn: 1 });
};

/**
 * 指定日の週の終了日（日曜日）を取得
 */
export const getWeekEnd = (date: Date): Date => {
  return endOfWeek(date, { weekStartsOn: 1 });
};

/**
 * 週の日付配列を取得（月曜日〜日曜日）
 */
export const getWeekDays = (date: Date): Date[] => {
  const start = getWeekStart(date);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

/**
 * 月の全日付を取得
 */
export const getMonthDays = (date: Date): Date[] => {
  return eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });
};

/**
 * 23:00の日時を作成
 */
const createDeadlineTime = (date: Date): Date => {
  return setMilliseconds(
    setSeconds(
      setMinutes(
        setHours(date, 23),
        0
      ),
      0
    ),
    0
  );
};

/**
 * 指定した日付・タスクタイプに対して入力が可能かどうかを判定
 *
 * @param targetDate - 入力対象の日付
 * @param taskType - タスクタイプ
 * @param now - 現在時刻（デフォルト: new Date()）
 * @returns 入力可能ならtrue
 */
export const canEditTask = (
  targetDate: Date,
  taskType: TaskType,
  now: Date = new Date()
): boolean => {
  switch (taskType) {
    case 'daily': {
      // 当日予定: 前日の23:00まで入力可能
      // 例: 12/8の予定は12/7の23:00まで入力可能

      // 入力対象日が今日より前なら不可
      if (isBefore(targetDate, now) && !isSameDay(targetDate, now)) {
        return false;
      }

      // 今日の予定は入力不可（前日23:00を過ぎている）
      if (isSameDay(targetDate, now)) {
        return false;
      }

      // 未来の日付なら入力可能
      return true;
    }

    case 'weekly': {
      // 週間予定: 当週の金曜日23:00まで入力可能（土日は参照のみ）
      const weekStart = getWeekStart(targetDate);
      const currentWeekStart = getWeekStart(now);

      // 対象週が過去の週なら不可
      if (isBefore(weekStart, currentWeekStart)) {
        return false;
      }

      // 当週の場合
      if (isSameDay(weekStart, currentWeekStart)) {
        const friday = addDays(currentWeekStart, 4); // 金曜日
        const deadline = createDeadlineTime(friday);

        // 金曜23:00以降（土曜日0:00以降）なら不可
        if (isAfter(now, deadline)) {
          return false;
        }

        return true;
      }

      // 未来の週なら入力可能
      return true;
    }

    case 'monthly': {
      // 月間目標: 当月25日23:00まで入力可能（26日以降は参照のみ）
      const targetYear = getYear(targetDate);
      const targetMonth = targetDate.getMonth();
      const currentYear = getYear(now);
      const currentMonth = now.getMonth();

      // 対象月が過去なら不可
      if (
        targetYear < currentYear ||
        (targetYear === currentYear && targetMonth < currentMonth)
      ) {
        return false;
      }

      // 当月の場合
      if (targetYear === currentYear && targetMonth === currentMonth) {
        const day25 = new Date(currentYear, currentMonth, 25);
        const deadline = createDeadlineTime(day25);

        // 25日23:00以降なら不可
        if (isAfter(now, deadline)) {
          return false;
        }

        return true;
      }

      // 未来の月なら入力可能
      return true;
    }

    default:
      return false;
  }
};

/**
 * 年・月・週番号から週のラベルを生成
 * 例: "2025年12月 第2週"
 */
export const getWeekLabel = (year: number, weekNumber: number): string => {
  return `${year}年 第${weekNumber}週`;
};

/**
 * 年月から月のラベルを生成
 * 例: "2025年12月"
 */
export const getMonthLabel = (year: number, month: number): string => {
  return `${year}年${month + 1}月`;
};

/**
 * UUIDを生成（簡易版）
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
