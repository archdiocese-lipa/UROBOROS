import { useState } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";

const SelectedDate = ({ date, onTimeChange, onRemove }) => {
  const [times, setTimes] = useState([{ time: null }]);

  const handleTimeChange = (index, time) => {
    const newTimes = [...times];
    newTimes[index].time = time;
    setTimes(newTimes);
    onTimeChange(date, newTimes);
  };

  const addMore = () => {
    setTimes([...times, { time: null }]);
  };

  const removeTime = (index) => {
    const newTimes = times.filter((_, i) => i !== index);
    setTimes(newTimes);
    onTimeChange(date, newTimes);
  };

  return (
    <div className="w-full rounded-lg border bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-gray-700 text-lg font-semibold">
          {new Date(date).toDateString()}
        </div>
        <Button variant="destructive" size="sm" onClick={() => onRemove(date)}>
          Remove Entry
        </Button>
      </div>
      <div className="grid gap-4">
        <div className="text-gray-600 grid grid-cols-2 items-center gap-4 font-semibold">
          <span>Time</span>
          <span></span>
        </div>
        {times.map((entry, index) => (
          <div
            key={index}
            className="grid grid-cols-2 items-center gap-4 rounded-lg border p-3"
          >
            <DatePicker
              selected={entry.time}
              onChange={(time) => handleTimeChange(index, time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              className="w-full rounded border px-3 py-2 text-sm"
              placeholderText="Select Time"
            />
            {times.length > 1 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeTime(index)}
              >
                X
              </Button>
            )}
          </div>
        ))}
        <Button type="button" onClick={addMore} className="mt-4 w-full">
          Add More Time Slots
        </Button>
      </div>
    </div>
  );
};

SelectedDate.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  onTimeChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default SelectedDate;
