import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const BigCalendar = ({ event, handleSelectEvent, eventPropGetter }) => {
    const localizer = momentLocalizer(moment);

    let formats = {
        timeGutterFormat: 'HH:mm',
    }

    return (
        <Calendar
            localizer={localizer}
            events={event}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 740, width: "100%" }}
            defaultView="week"
            getNow={() => new Date()}
            views={["day", "week", "month"]}
            onSelectEvent={handleSelectEvent}
            min={moment("2024-01-03T08:00:00").toDate()}
            max={moment("2024-01-03T20:40:00").toDate()}
            eventPropGetter={eventPropGetter}
            timeslots={5}
            step={4}
            dateFormat="h t"
            formats={formats}
        />
    );
};
export default BigCalendar;
