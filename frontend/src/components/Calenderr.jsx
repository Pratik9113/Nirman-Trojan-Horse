import * as React from "react";
import { Calendar } from "./ui/calendar";

export default function Calendarr() {
  // Use JavaScript without TypeScript syntax
  const [dates, setDates] = React.useState([]);  // Remove the `Date[]` type annotation

  return (
    <Calendar
      mode="single" // Or "multiple"
      selected={dates} // Passing an array of Date objects
      onSelect={setDates} // Update the state with selected dates
      className="rounded-md border shadow"
    />
  );
}
