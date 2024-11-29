import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from "prop-types";

const TimePicker = ({ value, onChange, className = "" }) => {
  return (
    <div className="relative mt-0">
      <DatePicker
        selected={value}
        onChange={onChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15} // 15-minute intervals
        timeCaption="Time"
        dateFormat="h:mm aa"
        className={`w-full rounded-md border border-secondary-accent bg-primary px-4 py-2 shadow-sm ${className}`}
        popperPlacement="bottom-start"
        placeholderText="Select a time"
      />
    </div>
  );
};

// Prop validation
TimePicker.propTypes = {
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]), // value should be a Date object
  onChange: PropTypes.func.isRequired, // onChange should be a function
  className: PropTypes.string, // className is optional and should be a string
};

export default TimePicker;
