'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
    const [status, setStatus] = useState('');

    const startServer = async () => {
        try {
            const res = await fetch('/api/mosserver/start');
            const data = await res.json();
            setStatus(data.status || 'Server started');
        } catch (err) {
            setStatus('Failed to start server');
        }
    };

    const stopServer = async () => {
        try {
            const res = await fetch('/api/mosserver/stop');
            const data = await res.json();
            console.log('Stopped:', data.status);
        } catch (err) {
            console.warn('Failed to stop server');
        }
    };

    useEffect(() => {
        // Start server when component mounts
        startServer();

        // Stop server when component unmounts
        return () => {
            stopServer();
        };
    }, []);

    return (
        <main style={{ padding: '2rem' }}>
            <h1>Start MOS TCP Server</h1>
            <p>{status}</p>
        </main>
    );
}
