import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { useCallback, useEffect, useState } from "react";

const DnDCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

const BigCalendar = ({
    event,
    handleSelectEvent,
    eventPropGetter,
    sendEventDataToBackend,
}) => {
    const [myEvents, setMyEvents] = useState(event);

    const formats = {
        timeGutterFormat: "HH:mm",
        eventTimeRangeFormat: ({ start, end }) =>
            `${moment(start).format("HH:mm")} - ${moment(end).format("HH:mm")}`,
    };

    const moveEvent = useCallback(
        ({ event, start, end }) => {
            setMyEvents((prev) => {
                const existing = prev.find((ev) => ev.id === event.id) ?? {};
                const filtered = prev.filter((ev) => ev.id !== event.id);
                sendEventDataToBackend({ ...existing, start, end });
                return [...filtered, { ...existing, start, end }];
            });
        },
        [setMyEvents]
    );

    const resizeEvent = useCallback(
        ({ event, start, end }) => {
            setMyEvents((prev) => {
                const existing = prev.find((ev) => ev.id === event.id) ?? {};
                const filtered = prev.filter((ev) => ev.id !== event.id);
                sendEventDataToBackend({ ...existing, start, end });
                return [...filtered, { ...existing, start, end }];
            });
        },
        [setMyEvents]
    );

    useEffect(() => {
        setMyEvents(event);
    }, [event]);

    return (
        <DnDCalendar
            localizer={localizer}
            events={myEvents}
            onEventDrop={moveEvent}
            onEventResize={resizeEvent}
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
            draggableAccessor="isDraggable"
            timeslots={5}
            step={4}
            formats={formats}
        />
    );
};
export default BigCalendar;
