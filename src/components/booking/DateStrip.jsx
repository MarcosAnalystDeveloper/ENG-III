import { nextDays, toISODate, formatDateLabel } from '../../utils/dateUtils';
import { BOOKING_HORIZON_DAYS } from '../../utils/constants';
import { barberWorksOn } from '../../services/availabilityService';
import './DateStrip.css';

export default function DateStrip({ selectedDate, onSelect, barberId }) {
  const days = nextDays(BOOKING_HORIZON_DAYS);

  return (
    <div className="date-strip">
      {days.map((date) => {
        const iso = toISODate(date);
        const { weekday, day, month } = formatDateLabel(date);
        const disabled = barberId ? !barberWorksOn(barberId, iso) : false;
        const selected = selectedDate === iso;

        return (
          <button
            key={iso}
            type="button"
            disabled={disabled}
            className={`date-chip ${selected ? 'is-selected' : ''}`}
            onClick={() => onSelect(iso)}
            title={disabled ? 'Profissional não atende neste dia' : undefined}
          >
            <span className="date-chip__weekday">{weekday}</span>
            <span className="date-chip__day">{day}</span>
            <span className="date-chip__month">{month}</span>
          </button>
        );
      })}
    </div>
  );
}
