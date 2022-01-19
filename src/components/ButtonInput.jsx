import React, { forwardRef } from "react";
import { format } from "date-fns";

const ButtonInput = forwardRef(({ value, onClick }, ref) => (
  <button
    onClick={onClick}
    ref={ref}
    type="button"
    className="inline-flex justify-start w-full px-3 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-pink"
  >
    {format(new Date(value), "dd MMMM yyyy")}
  </button>
));

export default ButtonInput;
