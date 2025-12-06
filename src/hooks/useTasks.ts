import { useState, useEffect } from 'react';
import type { Task, FilterOptions } from '../types';

const STORAGE_KEY = 'splendid_todo_tasks';

/**
 * タスク管理フック
 */
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // 初期読み込み
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setTasks(parsed);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // タスクが変更されたらlocalStorageに保存
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error('Failed to save tasks:', error);
      }
    }
  }, [tasks, loading]);

  /**
   * タスクを追加
   */
  const addTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  /**
   * タスクを更新
   */
  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  /**
   * タスクを削除
   */
  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  /**
   * フィルター条件に基づいてタスクを取得
   */
  const getFilteredTasks = (filters?: FilterOptions): Task[] => {
    if (!filters) return tasks;

    return tasks.filter((task) => {
      if (filters.category && task.category !== filters.category) return false;
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.type && task.type !== filters.type) return false;
      return true;
    });
  };

  /**
   * 特定の日付のタスクを取得
   */
  const getTasksByDate = (date: string): Task[] => {
    return tasks.filter((task) => task.date === date);
  };

  /**
   * 特定の週のタスクを取得
   */
  const getTasksByWeek = (weekNumber: number): Task[] => {
    return tasks.filter((task) => task.weekNumber === weekNumber && task.type === 'weekly');
  };

  /**
   * 特定の月のタスクを取得
   */
  const getTasksByMonth = (year: number, month: number): Task[] => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.date);
      return (
        taskDate.getFullYear() === year &&
        taskDate.getMonth() === month &&
        task.type === 'monthly'
      );
    });
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    getFilteredTasks,
    getTasksByDate,
    getTasksByWeek,
    getTasksByMonth,
  };
};
