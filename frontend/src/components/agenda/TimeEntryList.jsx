import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function TimeEntryList({ entries, onDelete }) {
  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) return `${h}h ${m}min`;
    return `${m}min`;
  };

  if (!entries || entries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        Aucune entrée de temps
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Entrées de temps</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {entries.map((entry) => (
          <div key={entry._id} className="px-6 py-4 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {entry.description || 'Sans description'}
              </p>
              <p className="text-xs text-gray-500">
                {format(new Date(entry.startTime), 'dd MMM yyyy HH:mm', { locale: fr })}
                {entry.endTime && ` - ${format(new Date(entry.endTime), 'HH:mm', { locale: fr })}`}
              </p>
              {entry.event && (
                <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded">
                  {entry.event.title}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <span className={`text-sm font-semibold ${entry.isRunning ? 'text-green-600' : 'text-gray-700'}`}>
                {entry.isRunning ? 'En cours...' : formatDuration(entry.duration)}
              </span>
              {!entry.isRunning && onDelete && (
                <button
                  onClick={() => onDelete(entry._id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Supprimer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
