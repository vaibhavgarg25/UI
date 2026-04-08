'use client';

import React from 'react';
import {
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
} from 'date-fns';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface NotesData {
  month: string;
  dates: Record<string, string>;
  ranges: Record<string, string>;
}

interface WallCalendarCardProps {
  currentDate: Date;
  days: Date[];
  monthStart: Date;
  monthEnd: Date;
  heroImage: string;
  notes: NotesData;
  onNotesChange: (notes: NotesData) => void;
  dateRange: DateRange;
  onDateClick: (day: Date) => void;
}

export default function WallCalendarCard({
  currentDate,
  days,
  heroImage,
  notes,
  onNotesChange,
  dateRange,
  onDateClick,
}: WallCalendarCardProps) {
  const monthName = format(currentDate, 'MMMM').toUpperCase();
  const year = format(currentDate, 'yyyy');

  const calendarDays = days.slice(0, 35);

  const singleDateKey =
    dateRange.start && !dateRange.end
      ? format(dateRange.start, 'yyyy-MM-dd')
      : null;

  const rangeKey =
    dateRange.start && dateRange.end
      ? `${format(dateRange.start, 'yyyy-MM-dd')}_${format(dateRange.end, 'yyyy-MM-dd')}`
      : null;

  const noteMode = rangeKey ? 'range' : singleDateKey ? 'date' : 'month';

  const displayedNotes =
  noteMode === 'range'
    ? notes.ranges[rangeKey!] || ''
    : noteMode === 'date'
    ? notes.dates[singleDateKey!] || ''
    : notes.month || '';
    
  const handleNotesChange = (value: string) => {
  if (noteMode === 'range' && rangeKey) {
    onNotesChange({
      ...notes,
      dates: notes.dates ?? {},
      ranges: {
        ...(notes.ranges ?? {}),
        [rangeKey]: value,
      },
    });
    return;
  }

  if (noteMode === 'date' && singleDateKey) {
    onNotesChange({
      ...notes,
      ranges: notes.ranges ?? {},
      dates: {
        ...(notes.dates ?? {}),
        [singleDateKey]: value,
      },
    });
    return;
  }

  onNotesChange({
    ...notes,
    dates: notes.dates ?? {},
    ranges: notes.ranges ?? {},
    month: value,
  });
};

  return (
    <div className="w-full flex justify-center px-4 sm:px-6 md:px-8">
      <div className="relative mt-6 w-full max-w-[320px] sm:max-w-[420px] md:max-w-[560px] lg:max-w-[680px]">
        <div className="overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-2xl">
          {/* Top */}
          <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden bg-gray-200">
            <img
              src={heroImage}
              alt={`${monthName} hero`}
              className="h-full w-full object-cover opacity-90"
            />

            <div className="absolute inset-0 bg-linear-to-br from-cyan-400/20 to-blue-500/15" />

            <div className="absolute bottom-4 right-4 text-right sm:bottom-5 sm:right-5 md:bottom-6 md:right-6">
              <p className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-wider text-white opacity-95">
                {year}
              </p>
              <p className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-white">
                {monthName}
              </p>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row">
            {/* Notes */}
            <div className="w-full border-b border-gray-200 p-4 sm:p-5 md:w-[42%] md:border-b-0 md:border-r md:p-6 lg:p-8">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-[10px] sm:text-xs uppercase font-semibold tracking-[0.2em] text-gray-600">
                  {noteMode === 'range'
                    ? 'Range Notes'
                    : noteMode === 'date'
                    ? 'Date Notes'
                    : 'Month Notes'}
                </h3>

                {noteMode === 'range' && dateRange.start && dateRange.end && (
                  <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700">
                    {format(dateRange.start, 'MMM d')} - {format(dateRange.end, 'MMM d')}
                  </span>
                )}

                {noteMode === 'date' && dateRange.start && (
                  <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700">
                    {format(dateRange.start, 'MMM d')}
                  </span>
                )}
              </div>

              <textarea
                value={displayedNotes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder={
                  noteMode === 'range'
                    ? 'Add notes for this selected date range...'
                    : noteMode === 'date'
                    ? 'Add notes for this date...'
                    : 'Add your notes for this month...'
                }
                className="min-h-[170px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 md:min-h-[220px]"
              />

              <p className="mt-3 text-[11px] text-gray-500">
                {noteMode === 'range'
                  ? 'These notes are attached to the selected range.'
                  : noteMode === 'date'
                  ? 'These notes are attached to the selected date.'
                  : 'These notes apply to the whole month.'}
              </p>
            </div>

            {/* Calendar */}
            <div className="w-full p-4 sm:p-5 md:w-[58%] md:p-6 lg:p-8">
              <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div
                    key={day}
                    className="flex h-6 sm:h-8 items-center justify-center text-[9px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {calendarDays.map((day, idx) => {
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isTodayDate = isToday(day);
                  const dayNum = day.getDate();
                  const isSunday = day.getDay() === 0;

                  const isStart =
                    !!dateRange.start && isSameDay(day, dateRange.start);

                  const isEnd =
                    !!dateRange.end && isSameDay(day, dateRange.end);

                  const isInRange =
                    !!dateRange.start &&
                    !!dateRange.end &&
                    isAfter(day, dateRange.start) &&
                    isBefore(day, dateRange.end);

                  const isSingleSelected =
                    !!dateRange.start &&
                    !dateRange.end &&
                    isSameDay(day, dateRange.start);

                  return (
                    <div
                      key={idx}
                      onClick={() => onDateClick(day)}
                      className={`
                        aspect-square flex items-center justify-center rounded-xl
                        text-[10px] sm:text-xs md:text-sm font-medium transition-all cursor-pointer select-none
                        ${!isCurrentMonth ? 'text-gray-300' : ''}
                        ${
                          isCurrentMonth && isSunday
                            ? 'text-blue-600'
                            : isCurrentMonth
                            ? 'text-gray-800'
                            : ''
                        }
                        ${isInRange ? 'bg-blue-100 text-blue-700' : ''}
                        ${
                          isTodayDate && !isStart && !isEnd && !isSingleSelected
                            ? 'ring-2 ring-blue-200'
                            : ''
                        }
                        ${
                          !isStart && !isEnd && !isSingleSelected
                            ? 'hover:bg-gray-100'
                            : ''
                        }
                      `}
                      style={
                        isStart || isEnd || isSingleSelected
                          ? {
                              backgroundColor: '#2563eb',
                              color: 'white',
                            }
                          : undefined
                      }
                    >
                      {dayNum}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                {!dateRange.start && !dateRange.end && (
                  <span>Click a date to view or add a note.</span>
                )}

                {dateRange.start && !dateRange.end && (
                  <span>
                    Selected date: <strong>{format(dateRange.start, 'MMM d, yyyy')}</strong>
                  </span>
                )}

                {dateRange.start && dateRange.end && (
                  <span>
                    Selected range:{' '}
                    <strong>
                      {format(dateRange.start, 'MMM d, yyyy')} - {format(dateRange.end, 'MMM d, yyyy')}
                    </strong>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}