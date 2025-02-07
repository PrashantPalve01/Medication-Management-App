const Dashboard = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* Today's Medications */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Today’s Medications</h2>
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow">
            <span>💊 Metformin (500mg)</span>
            <div className="space-x-2">
              <button className="px-3 py-1 bg-green-500 text-white rounded">
                Mark as Taken
              </button>
              <button className="px-3 py-1 bg-gray-300 rounded">Snooze</button>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Doses */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Upcoming Doses</h2>
        <ul className="space-y-2">
          <li className="p-2 bg-gray-50 rounded-lg">⏰ 10:00 AM - Insulin</li>
          <li className="p-2 bg-gray-50 rounded-lg">⏰ 2:00 PM - Amlodipine</li>
        </ul>
      </div>

      {/* Prescription Renewals */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Renewals Needed</h2>
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <span className="text-red-500">⚠️ Insulin (2 days left)</span>
          <button className="px-3 py-1 bg-blue-500 text-white rounded">
            Request Renewal
          </button>
        </div>
      </div>

      {/* Adherence Stats */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Adherence This Week</h2>
        <div className="h-40 bg-gray-200 flex items-center justify-center rounded-lg">
          📊 Weekly Adherence Chart
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
