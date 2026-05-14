import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function CalendarView({ events, onDateClick, onEventClick }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events.map((event) => ({
          id: event._id,
          title: event.title,
          start: event.startTime,
          end: event.endTime,
          backgroundColor: event.color || '#4f46e5',
          borderColor: event.color || '#4f46e5',
          extendedProps: { ...event },
        }))}
        dateClick={(info) => onDateClick && onDateClick(info.dateStr)}
        eventClick={(info) => onEventClick && onEventClick(info.event.extendedProps)}
        editable={false}
        selectable={true}
        height="auto"
        locale="fr"
        buttonText={{
          today: "Aujourd'hui",
          month: 'Mois',
          week: 'Semaine',
          day: 'Jour',
        }}
      />
    </div>
  );
}
