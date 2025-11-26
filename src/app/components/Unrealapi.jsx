"use client";

import { useState } from "react";

export default function Unrealapi() {
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
    async function aa() {
        setResult("Loading...");

        try {
            // Hardcoded API route
            // const res = await fetch("/api/unreal/remote/object/property");

            const objectPath = "/Game/Main.Main:PersistentLevel.SkyLight_1";

            const res = await fetch(
                `/api/unreal/remote/object/property?objectPath=${encodeURIComponent(objectPath)}`
            );

            const json = await res.json();
            setResult(JSON.stringify(json, null, 2));
        } catch (err) {
            setResult("Error: " + err.message);
        }
    }
    // inside your Unreal component (app/remote/page.jsx or wherever)
    async function getLocation() {
        setResult("Loading location...");
        try {
            // if you want to pass a custom path, add ?objectPath=...; else API uses default
            const res = await fetch("/api/unreal/remote/object/call-location");
            const json = await res.json();
            if (json.ok) {
                if (json.location) {
                    setResult(`Location: x=${json.location.x} y=${json.location.y} z=${json.location.z}\n\nRaw:\n${JSON.stringify(json.raw, null, 2)}`);
                } else {
                    setResult(`No parsed location found.\n\nRaw:\n${JSON.stringify(json.raw, null, 2)}`);
                }
            } else {
                setResult("UE error: " + JSON.stringify(json));
            }
        } catch (err) {
            setResult("Error: " + err.message);
        }
    }



    async function IsEditorMode() {
        setResult("Loading location...");
        try {
            const res = await fetch("/api/unreal/remote/object/call", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    objectPath: "/Script/Wingman.Default__V3FL",
                    functionName: "IsEditorMode",
                    Parameters: {},
                    GenerateTransaction: true,
                }),
            });
            // console.log(res)
            const json = await res.json();
            setResult(JSON.stringify(json));
        } catch (err) {
            setResult("Error: " + err.message);
        }
    }
    async function FetchV3PathLabels() {
        setResult("Loading location...");
        try {
            const res = await fetch("/api/unreal/remote/object/call", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    objectPath: "/Script/Wingman.Default__V3FL",
                    functionName: "FetchV3PathLabels",
                    Parameters: {},
                    GenerateTransaction: true,
                }),
            });
            // console.log(res)
            const json = await res.json();
            setResult(JSON.stringify(json));
        } catch (err) {
            setResult("Error: " + err.message);
        }
    }



    // set actor location
    async function setActorLocation() {
        setResult("Setting actor location...");
        try {
            const res = await fetch("/api/unreal/remote/object/set-actor-location", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    objectPath: "/Game/Main.Main:PersistentLevel.SkyLight_1", // actor
                    x: 100,
                    y: 200,
                    z: 300
                })
            });
            const json = await res.json();
            setResult(JSON.stringify(json, null, 2));
        } catch (err) {
            setResult("Error: " + err.message);
        }
    }



    // set component location
    async function setComponentrelativeLocation() {
        setResult("Setting component location...");
        try {
            const res = await fetch("/api/unreal/remote/object/set-component-relative-location", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    componentPath: "/Game/Main.Main:PersistentLevel.SkyLight_1.SkyLightComponent0",
                    x: 10,
                    y: 20,
                    z: 30
                })
            });
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

            <button onClick={aa}> get property</button>
            <button onClick={getLocation} style={{ marginLeft: 8 }}>Get Location</button>
            <button onClick={setActorLocation}>Set Actor Location</button>
            <button onClick={setComponentrelativeLocation} style={{ marginLeft: 8 }}>Set Component Location</button>
            <button onClick={FetchV3PathLabels} style={{ marginLeft: 8 }}>FetchV3PathLabels</button>
            <button onClick={IsEditorMode} style={{ marginLeft: 8 }}>IsEditorMode</button>

        </div>
    );
}
