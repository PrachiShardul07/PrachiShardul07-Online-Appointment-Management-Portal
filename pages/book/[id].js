// pages/book/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { format, addMinutes } from 'date-fns';

function generateSlots(start = '09:00', end = '17:00', interval = 15) {
  const [sH, sM] = start.split(':').map(Number);
  const [eH, eM] = end.split(':').map(Number);
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), sH, sM);
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), eH, eM);
  const slots = [];
  let cur = startDate;
  while (cur <= endDate) {
    slots.push(format(cur, 'HH:mm'));
    cur = addMinutes(cur, interval);
  }
  return slots;
}

export default function BookPage() {
  const router = useRouter();
  const { id } = router.query;
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [patientName, setPatientName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch('/api/doctors')
      .then(res => res.json())
      .then(list => setDoctor(list.find(x => x._id === id)));
  }, [id]);

  useEffect(() => {
    if (!date || !doctor) return;
    // fetch appointments for that doctor & date, then compute free slots
    const fetchBooked = async () => {
      // reuse admin endpoint? public endpoint not present; use query param to appointments route
      const res = await fetch(`/api/admin/appointments`);
      // admin endpoint is protected; instead we will create a public helper API for booked slots:
      // We'll call /api/booked?doctorId=...&date=...
    };
  }, [date, doctor]);

  // Rather than depend on admin endpoint, create a public endpoint below named /api/booked
  // Implemented separately. For now, continue with UI:

  async function checkSlots() {
    if (!date) { setAvailableSlots([]); return; }
    const res = await fetch(`/api/booked?doctorId=${id}&date=${date}`);
    const booked = await res.json(); // array of times ["09:00",...]
    const all = generateSlots('09:00', '16:45', 15); // end at 16:45 for last slot
    const free = all.filter(s => !booked.includes(s));
    setAvailableSlots(free);
    setSelectedSlot('');
  }

  useEffect(() => {
    checkSlots();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, doctor]);

  async function onSubmit(e) {
    e.preventDefault();
    setMessage('');
    if (!patientName || !selectedSlot || !date) {
      setMessage('Please provide name, date and select a slot.');
      return;
    }

    const payload = {
      patientName,
      doctorId: id,
      date,
      time: selectedSlot,
      email
    };

    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (!res.ok) {
      setMessage(result.error || 'Booking failed');
    } else {
      setMessage('Booked successfully! A confirmation was sent to your email if provided.');
    }
  }

  if (!doctor) return <p>Loading doctor...</p>;

  return (
    <>
      <Navbar />
      <main className="max-w-xl mx-auto mt-10 bg-white p-8 shadow-md rounded-xl">
        <h2 className="text-2xl font-bold">Book Appointment with {doctor.name}</h2>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm">Your Name</label>
            <input value={patientName} onChange={(e)=>setPatientName(e.target.value)} className="w-full border rounded-lg p-2 mt-1" />
          </div>

          <div>
            <label className="block text-sm">Email (optional)</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full border rounded-lg p-2 mt-1" />
          </div>

          <div>
            <label className="block text-sm">Date</label>
            <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="w-full border rounded-lg p-2 mt-1" />
          </div>

          <div>
            <label className="block text-sm mb-2">Available Slots</label>
            {availableSlots.length === 0 ? <p className="text-sm text-gray-500">No slots available or select a date</p> :
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map(slot => (
                  <button type="button" key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-3 rounded ${selectedSlot === slot ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            }
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Confirm Booking</button>
        </form>

        {message && <p className="mt-4 text-blue-600">{message}</p>}
      </main>
    </>
  );
}
