import React, { useState } from 'react'


const Worldlocation = ({ objectPath, Heading }) => {
    const [worldX, setWorldX] = useState(0)
    const [worldY, setWorldY] = useState(0)
    const [worldZ, setWorldZ] = useState(0)
    const [worldRotZ, setWorldRotZ] = useState(0)

    async function callSet({ value, functionName, objectPath }) {
        console.log("Sending:", value)
        try {
            const res = await fetch("/api/unreal/remote/object/call", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    objectPath,
                    functionName,
                    Parameters: { Float: parseFloat(value) },
                    GenerateTransaction: true,
                }),
            });
            const json = await res.json().catch(() => null);
            console.log("API replied:", res.status, json);
        } catch (err) {
            console.error("Error:", err.message)
        }
    }

    return (
        <>
            <div style={{ display: 'flex' }}>
                <div style={{ border: '1px solid red' }}>

                    <h3> {Heading}</h3>
                    <div>

                        <label htmlFor="worldX">Set X:</label>
                        <input
                            style={{ width: "60px" }}
                            type="number"
                            step="1"
                            value={worldX}
                            onChange={(e) => {
                                setWorldX(e.target.value);
                                callSet({ value: e.target.value, functionName: "SetX", objectPath });
                            }}
                        />
                    </div>

                    <div>
                        <label htmlFor="worldY">Set Y:</label>
                        <input
                            style={{ width: "60px" }}
                            type="number"
                            step="1"
                            value={worldY}
                            onChange={(e) => {
                                setWorldY(e.target.value);
                                callSet({ value: e.target.value, functionName: "SetY", objectPath });
                            }}
                        />
                    </div>

                    <div>
                        <label htmlFor="worldZ">Set Z:</label>
                        <input
                            style={{ width: "60px" }}
                            type="number"
                            step="1"
                            value={worldZ}
                            onChange={(e) => {
                                setWorldZ(e.target.value);
                                callSet({ value: e.target.value, functionName: "SetZ", objectPath });
                            }}
                        />
                    </div>

                    <div>
                        <label htmlFor="worldrotZ">Set Z:</label>
                        <input
                            style={{ width: "60px" }}
                            type="number"
                            step="1"
                            value={worldRotZ}
                            onChange={(e) => {
                                setWorldRotZ(e.target.value);
                                callSet({ value: e.target.value, functionName: "SetRotZ", objectPath });
                            }}
                        />
                    </div>
                </div>
            </div>
        </>)
}

export default Worldlocation
