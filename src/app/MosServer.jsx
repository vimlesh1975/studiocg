'use client';

import { useState } from 'react';

export default function HomePage() {
    const [status, setStatus] = useState('');

    const startServer = async () => {
        try {
            const res = await fetch('/api/mosserver/start');
            const data = await res.json();
            setStatus(data.status);
        } catch (err) {
            setStatus('Failed to start server');
        }
    };

    return (
        <main style={{ padding: '2rem' }}>
            <h1>Start MOS TCP Server</h1>
            <button onClick={startServer}>Start Server</button>
            <p>{status}</p>
        </main>
    );
}
