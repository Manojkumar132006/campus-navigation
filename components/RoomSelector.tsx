'use client';

interface RoomSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
}

export function RoomSelector({ value, onChange, label, placeholder }: RoomSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
        />
        
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Clear"
          >
            ✕
          </button>
        )}
      </div>
      
      <p className="mt-1 text-xs text-gray-500">
        Enter room (e.g., E-203, A-008) or location (e.g., Annapurna Canteen, JSK Greens)
      </p>
    </div>
  );
}
