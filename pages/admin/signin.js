// pages/admin/signin.js
import { getCsrfToken, getProviders, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Navbar from '../../components/Navbar';

export default function SignIn({ csrfToken }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submit(e) {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password
    });
    if (res?.ok) {
      router.push('/admin');
    } else {
      alert('Login failed');
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-md mx-auto mt-20 bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Admin Sign In</h2>
        <form onSubmit={submit} className="space-y-4">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <div>
            <label className="block text-sm">Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="w-full p-2 border rounded" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Sign In</button>
        </form>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context)
    }
  };
}
