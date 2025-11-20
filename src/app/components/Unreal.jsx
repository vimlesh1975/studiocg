"use client";

import { useState } from "react";

export default function Unreal() {
    const [result, setResult] = useState("Click the button to send request...");

    async function handleSend() {
        setResult("Loading...");

        try {
            // Hardcoded API route
            const res = await fetch("/api/unreal/remote/info");

            const json = await res.json();
            setResult(JSON.stringify(json, null, 2));
        } catch (err) {
            setResult("Error: " + err.message);
        }
    }

    return (
        <div
            style={{
                padding: "40px",
                fontFamily: "Arial",
                maxWidth: "700px",
                margin: "0 auto",
            }}
        >
            <h1>Remote Control API Test</h1>

            <button
                onClick={handleSend}
                style={{
                    marginTop: "20px",
                    padding: "12px 24px",
                    fontSize: "18px",
                    background: "#0070f3",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "6px",
                }}
            >
                SEND REQUEST
            </button>

            <h2 style={{ marginTop: "30px" }}>Response:</h2>

            <textarea
                readOnly
                value={result}
                style={{
                    width: "100%",
                    height: "300px",
                    background: "#111",
                    color: "#0f0",
                    padding: "20px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    whiteSpace: "pre-wrap",
                }}
            />
        </div>
    );
}
