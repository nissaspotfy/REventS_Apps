const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Inject updateEventSetting and handleDeleteEvent before handleCreateEventSubmit
const submitMarker = `const handleCreateEventSubmit = async (status: string = 'active') => {`;
const handlersCode = `
  const updateEventSetting = async (updates: any) => {
    if (!managingEvent) return;
    try {
      await apiFetch(\`/api/events/\${managingEvent.id}\`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      setManagingEvent({ ...managingEvent, ...updates });
      await loadEvents();
      setToast({ message: "Settings updated successfully!", show: true });
      setTimeout(() => setToast({ message: '', show: false }), 3000);
    } catch (err: any) {
      setToast({ message: err.message || "Failed to update settings", show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    }
  };

  const handleDeleteEvent = async () => {
    if (!managingEvent) return;
    if (!window.confirm("Are you sure you want to permanently delete this event?")) return;
    try {
      await apiFetch(\`/api/events/\${managingEvent.id}\`, {
        method: 'DELETE'
      });
      setManagingEvent(null);
      setManagingSubView('overview');
      await loadEvents();
      setToast({ message: "Event deleted successfully!", show: true });
      setTimeout(() => setToast({ message: '', show: false }), 3000);
    } catch (err: any) {
      setToast({ message: err.message || "Failed to delete event", show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    }
  };

`;
if (!content.includes('const updateEventSetting =')) {
  content = content.replace(submitMarker, `${handlersCode}  ${submitMarker}`);
}

// 2. Replace the placeholder Settings UI
const settingsUIMarker = /<div className="bg-slate-50 dark:bg-slate-800\/50 rounded-3xl border border-slate-100 dark:border-slate-700 p-12 text-center text-slate-500">\s*<Settings className="w-12 h-12 mx-auto mb-4 opacity-50" \/>\s*<p className="font-bold text-lg mb-2">Configuration Hub<\/p>\s*<p className="text-sm mb-6">Adjust visibility, capacities, and permissions\.<\/p>\s*<button onClick=\{[^}]+\} className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 rounded-xl font-bold transition-all shadow-md">Apply Settings<\/button>\s*<\/div>/g;

const settingsUIReplacement = `
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2"><Eye className="w-5 h-5 text-indigo-600"/> Visibility</h4>
                                    <button 
                                      onClick={() => updateEventSetting({ isPublic: !managingEvent.isPublic })} 
                                      className={\`w-12 h-6 rounded-full transition-colors relative \${managingEvent.isPublic !== false ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}\`}>
                                      <div className={\`w-4 h-4 bg-white rounded-full absolute top-1 transition-all \${managingEvent.isPublic !== false ? 'left-7' : 'left-1'}\`}/>
                                    </button>
                                  </div>
                                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                    {managingEvent.isPublic !== false 
                                      ? "Public: Acara ini akan muncul di beranda dan hasil pencarian REventS." 
                                      : "Private: Acara ini hanya bisa diakses menggunakan tautan langsung."}
                                  </p>
                                </div>
                              </div>

                              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2"><Lock className="w-5 h-5 text-amber-600"/> Kontrol Penjualan</h4>
                                    <button 
                                      onClick={() => updateEventSetting({ isSalesClosed: !managingEvent.isSalesClosed })} 
                                      className={\`w-12 h-6 rounded-full transition-colors relative \${managingEvent.isSalesClosed ? 'bg-amber-600' : 'bg-slate-300 dark:bg-slate-600'}\`}>
                                      <div className={\`w-4 h-4 bg-white rounded-full absolute top-1 transition-all \${managingEvent.isSalesClosed ? 'left-7' : 'left-1'}\`}/>
                                    </button>
                                  </div>
                                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                    {managingEvent.isSalesClosed 
                                      ? "Ditutup: Penjualan tiket sedang dihentikan secara manual." 
                                      : "Dibuka: Pengguna dapat terus membeli tiket acara ini."}
                                  </p>
                                </div>
                              </div>

                              <div className="md:col-span-2 bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-100 dark:border-red-900/30">
                                <h4 className="font-bold text-lg text-red-600 dark:text-red-400 flex items-center gap-2 mb-2"><AlertTriangle className="w-5 h-5"/> Danger Zone</h4>
                                <p className="text-sm text-red-500 dark:text-red-300 mb-6">Tindakan di area ini tidak dapat dipulihkan atau berdampak besar pada peserta acara Anda.</p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                  <button onClick={() => updateEventSetting({ status: 'cancelled' })} className="px-6 py-3 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm flex-1">
                                    Batalkan Acara
                                  </button>
                                  <button onClick={handleDeleteEvent} className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all text-sm shadow-md shadow-red-200 dark:shadow-none flex-1">
                                    Hapus Acara Permanen
                                  </button>
                                </div>
                              </div>
                            </div>
`;

content = content.replace(settingsUIMarker, settingsUIReplacement);

fs.writeFileSync(file, content, 'utf8');
console.log("App.tsx settings updated successfully");
