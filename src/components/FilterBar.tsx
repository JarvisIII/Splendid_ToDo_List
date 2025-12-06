import type { Category, Status, Priority, FilterOptions } from '../types';
import { CATEGORY_CONFIG, STATUS_CONFIG, PRIORITY_CONFIG } from '../constants';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export const FilterBar = ({ filters, onFilterChange }: FilterBarProps) => {
  const handleCategoryChange = (category: Category | undefined) => {
    onFilterChange({ ...filters, category });
  };

  const handleStatusChange = (status: Status | undefined) => {
    onFilterChange({ ...filters, status });
  };

  const handlePriorityChange = (priority: Priority | undefined) => {
    onFilterChange({ ...filters, priority });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = filters.category || filters.status || filters.priority;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">フィルター</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            クリア
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* カテゴリーフィルター */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            カテゴリー
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange(undefined)}
              className={`
                px-3 py-1 rounded-md text-sm transition-all
                ${!filters.category
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              すべて
            </button>
            {(Object.keys(CATEGORY_CONFIG) as Category[]).map((cat) => {
              const config = CATEGORY_CONFIG[cat];
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`
                    px-3 py-1 rounded-md text-sm transition-all
                    ${filters.category === cat
                      ? `${config.bgColor} ${config.color} border-2 ${config.borderColor}`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ステータスフィルター */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ステータス
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusChange(undefined)}
              className={`
                px-3 py-1 rounded-md text-sm transition-all
                ${!filters.status
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              すべて
            </button>
            {(Object.keys(STATUS_CONFIG) as Status[]).map((stat) => {
              const config = STATUS_CONFIG[stat];
              return (
                <button
                  key={stat}
                  onClick={() => handleStatusChange(stat)}
                  className={`
                    px-3 py-1 rounded-md text-sm transition-all
                    ${filters.status === stat
                      ? `bg-blue-100 ${config.color} border-2 border-blue-300`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 優先度フィルター */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            優先度
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handlePriorityChange(undefined)}
              className={`
                px-3 py-1 rounded-md text-sm transition-all
                ${!filters.priority
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              すべて
            </button>
            {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((pri) => {
              const config = PRIORITY_CONFIG[pri];
              return (
                <button
                  key={pri}
                  onClick={() => handlePriorityChange(pri)}
                  className={`
                    px-3 py-1 rounded-md text-sm transition-all
                    ${filters.priority === pri
                      ? `bg-yellow-100 ${config.color} border-2 border-yellow-300`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
