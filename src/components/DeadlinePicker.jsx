import React from "react";
import DatePicker from "react-datepicker";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { format } from "date-fns";
import ButtonInput from "./ButtonInput";

const DeadlinePicker = ({ date, setDate }) => {
  return (
    <div className="relative flex-1">
      <DatePicker
        selected={date}
        onChange={(date) => setDate(date)}
        selectsStart
        startDate={date}
        nextMonthButtonLabel=">"
        previousMonthButtonLabel="<"
        popperClassName="react-datepicker-left"
        customInput={<ButtonInput />}
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="flex items-center justify-between px-2 py-2">
            <span className="text-lg text-zinc-700">
              {format(date, "MMMM yyyy")}
            </span>

            <div className="space-x-2">
              <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                type="button"
                className={`${
                  prevMonthButtonDisabled && "cursor-not-allowed opacity-50"
                } inline-flex p-1 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-pink`}
              >
                <ChevronLeftIcon className="w-5 h-5 text-zinc-600" />
              </button>

              <button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                type="button"
                className={`${
                  nextMonthButtonDisabled && "cursor-not-allowed opacity-50"
                } inline-flex p-1 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-pink`}
              >
                <ChevronRightIcon className="w-5 h-5 text-zinc-600" />
              </button>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default DeadlinePicker;
