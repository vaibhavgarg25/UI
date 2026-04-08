'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import WallCalendarCard from './WallCalendarCard';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=600&h=400&fit=crop',
];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface NotesData {
  month: string;
  dates: Record<string, string>;
  ranges: Record<string, string>;
}

export default function WallCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [notes, setNotes] = useState<Record<string, NotesData>>({});
  const [isLoading, setIsLoading] = useState(true);

  const pickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem('wallCalendarNotes');
    const savedRange = localStorage.getItem('wallCalendarDateRange');

    if (savedNotes) {
      const parsed = JSON.parse(savedNotes);

      const normalized = Object.fromEntries(
        Object.entries(parsed).map(([key, value]: [string, any]) => [
          key,
          {
            month: value?.month ?? '',
            dates: value?.dates ?? {},
            ranges: value?.ranges ?? {},
          },
        ])
      );

      setNotes(normalized);
    }

    if (savedRange) {
      const parsed = JSON.parse(savedRange);
      setDateRange({
        start: parsed.start ? new Date(parsed.start) : null,
        end: parsed.end ? new Date(parsed.end) : null,
      });
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('wallCalendarNotes', JSON.stringify(notes));
      localStorage.setItem(
        'wallCalendarDateRange',
        JSON.stringify({
          start: dateRange.start ? dateRange.start.toISOString() : null,
          end: dateRange.end ? dateRange.end.toISOString() : null,
        })
      );
    }
  }, [notes, dateRange, isLoading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
    setShowPicker(false);
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
    setShowPicker(false);
  };

  const handleDateClick = (day: Date) => {
    if (!dateRange.start && !dateRange.end) {
      setDateRange({ start: day, end: null });
      return;
    }

    if (dateRange.start && !dateRange.end) {
      const sameDay = day.toDateString() === dateRange.start.toDateString();

      if (sameDay) {
        setDateRange({ start: day, end: null });
        return;
      }

      if (day < dateRange.start) {
        setDateRange({ start: day, end: dateRange.start });
      } else {
        setDateRange({ start: dateRange.start, end: day });
      }
      return;
    }

    setDateRange({ start: day, end: null });
  };

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 10;
    const endYear = currentYear + 10;

    return Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i
    );
  }, []);

  const monthKey = format(currentDate, 'yyyy-MM');
  const heroImageIndex = currentDate.getMonth() % HERO_IMAGES.length;

  const currentMonthNotes: NotesData = notes[monthKey] || {
    month: '',
    dates: {},
    ranges: {},
  };

  const handleNotesChange = (updatedNotes: NotesData) => {
    setNotes((prev) => ({
      ...prev,
      [monthKey]: updatedNotes,
    }));
  };

  const getDaysInCalendar = () => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

  const days = getDaysInCalendar();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <div className="mb-8">
          <div className="relative flex items-center justify-center">
            <button
              onClick={handlePreviousMonth}
              className="absolute left-0 rounded-full p-2 transition-colors hover:bg-white/60"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>

            <div className="relative text-center" ref={pickerRef}>
              <div
                onClick={() => setShowPicker((prev) => !prev)}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <h1 className="text-2xl md:text-4xl font-light tracking-wide text-gray-800">
                  {format(currentDate, 'MMMM yyyy')}
                </h1>

                <span
                  className={`text-gray-500 text-sm transition-transform duration-200 ${
                    showPicker ? 'rotate-180' : ''
                  }`}
                >
                  ▾
                </span>
              </div>

              {showPicker && (
                <div className="absolute left-1/2 z-50 mt-3 flex -translate-x-1/2 gap-3 rounded-xl bg-white p-4 shadow-lg border border-gray-100">
                  <select
                    value={currentDate.getMonth()}
                    onChange={(e) => {
                      const selectedMonth = Number(e.target.value);
                      setCurrentDate(
                        new Date(
                          currentDate.getFullYear(),
                          selectedMonth,
                          1
                        )
                      );
                      setShowPicker(false);
                    }}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-300"
                  >
                    {MONTHS.map((month, i) => (
                      <option key={month} value={i}>
                        {month}
                      </option>
                    ))}
                  </select>

                  <select
                    value={currentDate.getFullYear()}
                    onChange={(e) => {
                      const selectedYear = Number(e.target.value);
                      setCurrentDate(
                        new Date(
                          selectedYear,
                          currentDate.getMonth(),
                          1
                        )
                      );
                      setShowPicker(false);
                    }}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-300"
                  >
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button
              onClick={handleNextMonth}
              className="absolute right-0 rounded-full p-2 transition-colors hover:bg-white/60"
              aria-label="Next month"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>

        <WallCalendarCard
          currentDate={currentDate}
          days={days}
          monthStart={monthStart}
          monthEnd={monthEnd}
          heroImage={HERO_IMAGES[heroImageIndex]}
          notes={currentMonthNotes}
          onNotesChange={handleNotesChange}
          dateRange={dateRange}
          onDateClick={handleDateClick}
        />
      </div>
    </div>
  );
}