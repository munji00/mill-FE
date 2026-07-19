import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial value or default to today's date
  const getInitialDate = (val: string) => {
    if (!val) return new Date();
    const d = new Date(val);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const [currentDate, setCurrentDate] = useState(() => getInitialDate(value));
  const [navDate, setNavDate] = useState(() => {
    const d = getInitialDate(value);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // Sync state if value prop changes
  useEffect(() => {
    const d = getInitialDate(value);
    setCurrentDate(d);
    setNavDate(new Date(d.getFullYear(), d.getMonth(), 1));
  }, [value]);

  // Handle click outside to close the calendar popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNavDate(new Date(navDate.getFullYear(), navDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNavDate(new Date(navDate.getFullYear(), navDate.getMonth() + 1, 1));
  };

  const handleDaySelect = (dayNum: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const selected = new Date(navDate.getFullYear(), navDate.getMonth(), dayNum);
    // Format to YYYY-MM-DD in local time
    const yyyy = selected.getFullYear();
    const mm = String(selected.getMonth() + 1).padStart(2, "0");
    const dd = String(selected.getDate()).padStart(2, "0");
    const formatted = `${yyyy}-${mm}-${dd}`;
    onChange(formatted);
    setIsOpen(false);
  };

  // Days calculations
  const year = navDate.getFullYear();
  const month = navDate.getMonth();

  // First day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Total days in the month
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Days array
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input Display Area */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 bg-white cursor-pointer select-none min-h-[34px]"
      >
        <span className={value ? "text-slate-800 font-mono font-medium" : "text-slate-400"}>
          {value ? value : placeholder}
        </span>
        <CalendarIcon size={14} className="text-slate-400 ml-2 shrink-0" />
      </div>

      {/* Floating Popover Calendar Card */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 z-40 bg-white rounded-xl border border-slate-200/80 shadow-xl p-4 w-[280px] animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Popover Header */}
          <div className="flex items-center justify-between mb-3.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-slate-800 select-none">
              {monthNames[month]} {year}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Weekday Titles Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 select-none">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
            {/* Blank spacer slots */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <span key={`empty-${i}`} className="p-1.5"></span>
            ))}

            {/* Days buttons */}
            {daysArray.map((day) => {
              const isSelected =
                value &&
                currentDate.getDate() === day &&
                currentDate.getMonth() === month &&
                currentDate.getFullYear() === year;

              return (
                <button
                  type="button"
                  key={`day-${day}`}
                  onClick={(e) => handleDaySelect(day, e)}
                  className={`p-1.5 rounded-lg transition text-center focus:outline-none cursor-pointer ${
                    isSelected
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
