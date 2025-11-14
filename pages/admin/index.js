// pages/admin/index.js
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Navbar from '../../components/Navbar';
import dynamic from 'next/dynamic';

// Recharts is client-only; dynamic import without SSR
const BarChart = dynamic(() => import('../../components/ApptChart'), { ssr: false });

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [appts, setAppts] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/admin/appointments')
      .then(res => res.json())
      .then(setAppts)
      .catch(console.error);

    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(setStats)
      .catch(console.error);
  }, [status]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status !== 'authenticated') return (
    <>
      <Navbar />
      <main className="max-w-xl mx-auto mt-20 p-6 bg-white shadow rounded">
        <p>You must <a href="/admin/signin" className="text-blue-600">sign in</a> as admin.</p>
      </main>
    </>
  );

  async function cancel(id) {
    if (!confirm('Cancel this appointment?')) return;
    const res = await fetch(`/api/admin/appointments/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setAppts(prev => prev.filter(a => a._id !== id));
      // refresh stats
      const s = await fetch('/api/admin/stats').then(r => r.json());
      setStats(s);
    } else {
      alert('Delete failed');
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto mt-10 px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <div>
            <span className="mr-4">Signed in as {session.user.email}</span>
            <button onClick={() => signOut()} className="bg-gray-200 px-3 py-1 rounded">Sign out</button>
          </div>
        </div>

        <section className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2 bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Appointments</h3>
            <div className="space-y-3 max-h-96 overflow-auto">
              {appts.length === 0 ? <p>No appointments</p> : appts.map(a => (
                <div key={a._id} className="flex items-center justify-between border p-3 rounded">
                  <div>
                    <div className="font-medium">{a.patientName}</div>
                    <div className="text-sm text-gray-600">{a.doctor?.name || '—'} • {a.date} {a.time}</div>
                    {a.email && <div className="text-sm text-gray-500">Email: {a.email}</div>}
                  </div>
                  <div>
                    <button onClick={() => cancel(a._id)} className="bg-red-500 text-white px-3 py-1 rounded">Cancel</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Appointments / Doctor</h3>
            {stats.length === 0 ? <p>No data</p> : <BarChart data={stats} />}
          </div>
        </section>
      </main>
    </>
  );
}
