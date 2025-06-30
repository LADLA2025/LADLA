import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';

const Reservation = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentView, setCurrentView] = useState('timeGridWeek');

  // Détection du mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768 && currentView === 'dayGridMonth') {
        setCurrentView('timeGridDay');
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [currentView]);

  // Exemple d'événements
  const events = [
    {
      title: 'Révision - Jean Dupont',
      start: '2024-02-20T09:00:00',
      end: '2024-02-20T11:00:00',
      backgroundColor: '#FFA600',
      borderColor: '#FFA600'
    },
    {
      title: 'Changement pneus - Marie Martin',
      start: '2024-02-20T14:00:00',
      end: '2024-02-20T16:00:00',
      backgroundColor: '#FFA600',
      borderColor: '#FFA600'
    }
  ];

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: isMobile ? 'timeGridDay' : 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events,
    dateClick: handleDateClick,
    eventClick: handleEventClick,
    height: 'auto',
    aspectRatio: isMobile ? 0.8 : 1.5,
    locale: frLocale,
    buttonText: {
      today: "Aujourd'hui",
      month: 'Mois',
      week: 'Semaine',
      day: 'Jour'
    },
    slotMinTime: '08:00:00',
    slotMaxTime: '19:00:00',
    slotDuration: '00:30:00',
    allDaySlot: false,
    expandRows: true,
    stickyHeaderDates: true,
    dayMaxEvents: isMobile ? 2 : true,
    nowIndicator: true,
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5, 6],
      startTime: '08:00',
      endTime: '19:00',
    },
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    views: {
      timeGridWeek: {
        titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
        dayHeaderFormat: { weekday: 'long', day: 'numeric' },
        slotLabelInterval: '01:00',
      },
      timeGridDay: {
        titleFormat: { weekday: 'long', day: 'numeric', month: 'long' },
        dayHeaderFormat: { weekday: 'long', day: 'numeric' },
        slotLabelInterval: '01:00',
      },
      dayGridMonth: {
        titleFormat: { year: 'numeric', month: 'long' },
        dayHeaderFormat: { weekday: 'short' }
      }
    }
  };

  const periods = [
    { label: "Aujourd'hui", value: 8 },
    { label: 'Cette semaine', value: 16 },
    { label: 'Ce mois', value: 24 },
    { label: 'Total', value: 32 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête fixe */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Réservations</h1>
          <button className="w-full sm:w-auto px-6 py-2 bg-gradient-to-br from-[#FFA600] to-orange-600 text-white rounded-lg hover:opacity-90 transition-opacity">
            + Nouvelle réservation
          </button>
        </div>
      </div>

      {/* Contenu principal avec défilement */}
      <div className="p-4 space-y-4">
        {/* Stats en grille responsive */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {periods.map((period, index) => (
            <div key={period.label} className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-sm text-gray-600">{period.label}</h3>
              <p className="text-2xl font-bold text-[#FFA600]">{period.value}</p>
              <p className="text-xs text-gray-500">réservations</p>
            </div>
          ))}
        </div>

        {/* Conteneur flexible pour le calendrier et le panneau latéral */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Calendrier responsive */}
          <div className="flex-grow bg-white rounded-xl shadow-sm p-4 min-h-[600px] overflow-x-auto">
            <div className="calendar-container" style={{ minWidth: isMobile ? 'auto' : '800px' }}>
              <FullCalendar {...calendarOptions} />
            </div>
          </div>

          {/* Panneau latéral collapsible sur mobile */}
          <div className="lg:w-80 space-y-4">
            {/* Formulaire de réservation rapide */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-4">Réservation rapide</h2>
              <form className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Client</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Service</label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>Choisir un service</option>
                    <option>Révision</option>
                    <option>Changement pneus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Date & Heure</label>
                  <input type="datetime-local" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <button className="w-full py-2 bg-[#FFA600] text-white rounded-lg">
                  Réserver
                </button>
              </form>
            </div>

            {/* Prochains rendez-vous */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-4">Prochains RDV</h2>
              <div className="space-y-2">
                {events.map((event, idx) => (
                  <div key={idx} className="p-3 border rounded-lg hover:bg-gray-50">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(event.start).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles CSS personnalisés pour le calendrier */}
      <style jsx global>{`
        .fc {
          font-family: inherit;
        }
        
        .fc .fc-toolbar {
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .fc .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: bold;
        }

        .fc .fc-button {
          padding: 0.4rem 0.65rem;
          font-size: 0.875rem;
        }

        .fc .fc-event {
          border-radius: 4px;
          font-size: 0.875rem;
          padding: 2px 4px;
        }

        .fc td, .fc th {
          border: 1px solid #e5e7eb;
        }

        .fc-timegrid-slot-label {
          font-size: 0.875rem;
          color: #666;
        }

        .fc-timegrid-axis {
          padding: 0 8px;
        }

        .fc-timegrid-slot {
          height: 40px !important;
        }

        .fc-timegrid-now-indicator-line {
          border-color: #FFA600;
        }

        .fc-timegrid-now-indicator-arrow {
          border-color: #FFA600;
          color: #FFA600;
        }

        .fc-event-time {
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .fc .fc-toolbar {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
          }
          
          .fc .fc-toolbar-title {
            grid-column: 1 / -1;
            text-align: center;
            font-size: 1.1rem;
          }

          .fc .fc-event {
            font-size: 0.75rem;
          }
          
          .fc td, .fc th {
            font-size: 0.875rem;
          }

          .fc-timegrid-slot {
            height: 35px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Reservation; 