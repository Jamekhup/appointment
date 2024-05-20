import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const BigCalendar = ({ event, handleSelectEvent, eventPropGetter }) => {
    const localizer = momentLocalizer(moment);

    const formats = {
        timeGutterFormat: "HH:mm",
        eventTimeRangeFormat: ({ start, end }) =>
            `${moment(start).format("HH:mm")} - ${moment(end).format("HH:mm")}`,
        // dayHeaderFormat: "dddd, D MMMM",
        // dayRangeHeaderFormat: ({ start, end }) =>
        //     `${moment(start).format("MMMM D")} - ${moment(end).format(
        //         "MMMM D, YYYY"
        //     )}`,
    };

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
