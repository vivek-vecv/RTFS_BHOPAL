import { memo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerCustom = memo(({ auditDate, setAuditDate, chassisNumber }) => {
  return (
    <div>
      <DatePicker
        selected={auditDate}
        onChange={(date) => setAuditDate(date)}
        showTimeSelect
        disabled={!chassisNumber}
        popperPlacement="auto"
        className="form-control w-100"
        dateFormat="Pp"
        timeFormat="HH:mm"
        timeIntervals={5}
        timeCaption="Time"
        dateFormatCalendar="MMMM"
        placeholderText="Select date and time"
      />
    </div>
  );
});

DatePickerCustom.displayName = 'DatePickerCustom';

export default DatePickerCustom;
