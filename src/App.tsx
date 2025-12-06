import { useState } from 'react';
import { DailyView } from './components/DailyView';
import { WeeklyView } from './components/WeeklyView';
import { MonthlyView } from './components/MonthlyView';
import { useTasks } from './hooks/useTasks';
import type { TaskType } from './types';

type ViewType = TaskType;

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('daily');
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Splendid ToDo List
          </h1>
        </div>
      </header>

      {/* タブナビゲーション */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentView('daily')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${currentView === 'daily'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              当日予定
            </button>
            <button
              onClick={() => setCurrentView('weekly')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${currentView === 'weekly'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              週間予定
            </button>
            <button
              onClick={() => setCurrentView('monthly')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${currentView === 'monthly'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              月間目標
            </button>
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'daily' && (
          <DailyView
            tasks={tasks}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        )}
        {currentView === 'weekly' && (
          <WeeklyView
            tasks={tasks}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        )}
        {currentView === 'monthly' && (
          <MonthlyView
            tasks={tasks}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        )}
      </main>

      {/* フッター */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            © 2025 Splendid ToDo List - すべての権利を保有
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
