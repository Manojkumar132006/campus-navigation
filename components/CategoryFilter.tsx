'use client';

interface CategoryFilterProps {
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  onClearFilters: () => void;
}

const CATEGORIES = [
  { id: 'academic', label: 'Academic', emoji: '📚', color: 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900' },
  { id: 'hostels', label: 'Hostels', emoji: '🏠', color: 'bg-blue-400 hover:bg-blue-500 text-blue-900' },
  { id: 'canteen', label: 'Canteens', emoji: '🍽️', color: 'bg-red-400 hover:bg-red-500 text-red-900' },
  { id: 'recreational', label: 'Recreational', emoji: '🌳', color: 'bg-green-400 hover:bg-green-500 text-green-900' },
  { id: 'administrative', label: 'Administrative', emoji: '🏛️', color: 'bg-purple-400 hover:bg-purple-500 text-purple-900' },
  { id: 'facility', label: 'Facilities', emoji: '🏗️', color: 'bg-gray-400 hover:bg-gray-500 text-gray-900' }
];

export function CategoryFilter({
  selectedCategories,
  onCategoryToggle,
  onClearFilters
}: CategoryFilterProps) {
  const isSelected = (categoryId: string) => selectedCategories.includes(categoryId);
  const hasFilters = selectedCategories.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Filter by Category</h3>
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium min-h-[32px] px-2"
          >
            Clear All
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const selected = isSelected(category.id);
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryToggle(category.id)}
              className={`
                px-3 py-2 rounded-full text-sm font-medium transition-all
                min-w-[44px] min-h-[44px] flex items-center gap-1
                ${selected 
                  ? category.color + ' ring-2 ring-offset-2 ring-gray-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }
              `}
              aria-pressed={selected}
            >
              <span>{category.emoji}</span>
              <span className="hidden sm:inline">{category.label}</span>
            </button>
          );
        })}
      </div>

      {hasFilters && (
        <p className="text-xs text-gray-500 mt-3">
          Showing {selectedCategories.length} {selectedCategories.length === 1 ? 'category' : 'categories'}
        </p>
      )}
    </div>
  );
}
