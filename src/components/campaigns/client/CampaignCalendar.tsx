import React, { useState } from "react";
import {
  Calendar,
  Clock,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import {
  formatDate,
  formatTimeRemaining,
  getRelativeTime,
} from "@/lib/utils/dateFormatter";

// Define the Campaign interface
interface Campaign {
  deadline?: string | Date | null;
  // Add other campaign properties as needed
}

interface CampaignCalendarProps {
  campaign: Campaign;
}

const CampaignCalendar: React.FC<CampaignCalendarProps> = ({ campaign }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Get the first day of the month
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );

  // Get the first day of the week (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Get the number of days in the month
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  // Create an array of day numbers
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Create an array for the blank spaces before the first day
  const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  // Campaign deadline
  const deadline = campaign.deadline ? new Date(campaign.deadline) : null;

  // Check if a day is the campaign deadline
  const isDeadlineDay = (day: number): boolean => {
    if (!deadline) return false;
    return (
      day === deadline.getDate() &&
      currentMonth.getMonth() === deadline.getMonth() &&
      currentMonth.getFullYear() === deadline.getFullYear()
    );
  };

  // Format deadline time
  const formatDeadlineTime = (): string => {
    if (!deadline) return "";
    return deadline.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format month and year
  const formatMonthYear = (date: Date): string => {
    return formatDate(date, {
      month: "long",
      year: "numeric",
    });
  };

  // Navigate to previous month
  const prevMonth = (): void => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  // Navigate to next month
  const nextMonth = (): void => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Go to current month
  const goToToday = (): void => {
    setCurrentMonth(new Date());
  };

  // Go to deadline month
  const goToDeadline = (): void => {
    if (deadline) {
      setCurrentMonth(new Date(deadline.getFullYear(), deadline.getMonth(), 1));
    }
  };

  // Calculate days left
  const daysLeft = deadline
    ? Math.max(
        0,
        Math.ceil(
          (deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        )
      )
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header with campaign deadline info */}
      <div className="bg-indigo-700 text-white p-6">
        <h3 className="font-bold text-xl mb-2 flex items-center">
          <Calendar className="mr-2" />
          {deadline ? "Thời hạn chiến dịch" : "Lịch chiến dịch"}
        </h3>

        {deadline ? (
          <div className="space-y-2">
            <p className="flex items-center">
              <CalendarDays size={18} className="mr-2 opacity-80" />
              {formatDate(deadline, {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="flex items-center">
              <Clock size={18} className="mr-2 opacity-80" />
              {formatDeadlineTime()}
            </p>
            {daysLeft !== null && (
              <div className="mt-4 bg-white/20 rounded-lg p-3 flex items-center">
                {daysLeft > 0 ? (
                  <>
                    <div className="bg-white text-indigo-700 rounded-lg w-12 h-12 flex items-center justify-center text-xl font-bold mr-3">
                      {daysLeft}
                    </div>
                    <div>
                      <p className="font-bold">Ngày còn lại</p>
                      <p className="text-sm opacity-80">Để đạt mục tiêu</p>
                    </div>
                  </>
                ) : (
                  <p className="font-bold">Chiến dịch đã kết thúc</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <p>Chiến dịch này không có thời hạn cụ thể</p>
        )}
      </div>

      {/* Calendar view */}
      <div className="p-4">
        {/* Calendar navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <h4 className="font-medium text-gray-700">
            {formatMonthYear(currentMonth)}
          </h4>

          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {/* Weekday headers */}
          {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day, index) => (
            <div
              key={index}
              className="text-center text-sm font-medium text-gray-500 py-1"
            >
              {day}
            </div>
          ))}

          {/* Blank spaces */}
          {blanks.map((blank, index) => (
            <div key={`blank-${index}`} className="p-2"></div>
          ))}

          {/* Calendar days */}
          {days.map((day) => (
            <div
              key={`day-${day}`}
              className={`p-2 text-center ${
                isDeadlineDay(day)
                  ? "bg-indigo-100 text-indigo-700 font-bold rounded-lg border-2 border-indigo-500"
                  : ""
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar actions */}
        <div className="flex gap-2">
          <button
            onClick={goToToday}
            className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Hôm nay
          </button>

          {deadline && (
            <button
              onClick={goToDeadline}
              className="flex-1 py-2 px-4 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg text-sm font-medium transition-colors"
            >
              Đến hạn chót
            </button>
          )}
        </div>
      </div>

      {/* Additional info */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-gray-700">
            <Users size={18} className="mr-2 text-indigo-600" />
            <span className="font-medium">Người ủng hộ gần đây</span>
          </div>
          <span className="text-sm text-indigo-600 font-medium">
            Xem tất cả
          </span>
        </div>

        {/* Dummy recent donors - in a real app, these would come from campaign data */}
        <div className="space-y-3">
          {[1, 2, 3].map((donor) => (
            <div key={donor} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 mr-2"></div>
                <div className="text-sm">
                  <p className="font-medium text-gray-800">
                    Người ủng hộ {donor}
                  </p>
                  <p className="text-xs text-gray-500">2 giờ trước</p>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-800">200,000 ₫</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignCalendar;
