import React, { useState } from 'react'

const Cam = ({ Heading, objectPath }) => {
    const [worldX, setWorldX] = useState(0)
    const [worldY, setWorldY] = useState(0)
    const [worldZ, setWorldZ] = useState(0)
    const [worldRotX, setWorldRotX] = useState(0)
    const [worldRotY, setWorldRotY] = useState(0)
    const [worldRotZ, setWorldRotZ] = useState(0)
    const [focus, setFocus] = useState(0)
    const [oneWayDistance, SetOneWayDistance] = useState(100)
    const [oneWayTime, SetOneWayTime] = useState(1)



    async function callSet({ value, functionName, objectPath }) {


        try {
            const res = await fetch("/api/unreal/remote/object/call", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    objectPath,
                    functionName,
                    Parameters: { float: parseFloat(value), Distance: parseFloat(value), Time: parseFloat(value) },
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
            <div>
                <h3> {Heading}</h3>

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
                <label htmlFor="worldrotX">Set Pan:</label>
                <input
                    style={{ width: "60px" }}
                    type="number"
                    step="1"
                    value={worldRotX}
                    onChange={(e) => {
                        setWorldRotX(e.target.value);
                        callSet({ value: e.target.value, functionName: "SetPan", objectPath });
                    }}
                />
            </div>

            <div>
                <label htmlFor="worldrotY">Set Tilt:</label>
                <input
                    style={{ width: "60px" }}
                    type="number"
                    step="1"
                    value={worldRotY}
                    onChange={(e) => {
                        setWorldRotY(e.target.value);
                        callSet({ value: e.target.value, functionName: "SetTilt", objectPath });
                    }}
                />
            </div>

            <div>
                <label htmlFor="worldrotZ">Set Zoom:</label>
                <input
                    style={{ width: "60px" }}
                    type="number"
                    step="1"
                    value={worldRotZ}
                    onChange={(e) => {
                        setWorldRotZ(e.target.value);
                        callSet({ value: e.target.value, functionName: "SetZoom", objectPath });
                    }}
                />
            </div>

            <div>
                <label htmlFor="worldrotZ">Set Focus:</label>
                <input
                    style={{ width: "60px" }}
                    type="number"
                    step="1"
                    value={focus}
                    onChange={(e) => {
                        setFocus(e.target.value);
                        callSet({ value: e.target.value, functionName: "SetFocus", objectPath });
                    }}
                />
            </div>
            <div style={{ border: '2px solid blue' }}>
                <div>
                    <label htmlFor="worldrotZ">SetOneWayDistance:</label>
                    <input
                        style={{ width: "60px" }}
                        type="number"
                        step="1"
                        value={oneWayDistance}
                        onChange={(e) => {
                            SetOneWayDistance(e.target.value);
                            callSet({ value: e.target.value, functionName: "SetOneWayDistance", objectPath });
                        }}
                    />
                </div>
                <div >
                    <label htmlFor="worldrotZ">SetOneWayTime:</label>
                    <input
                        style={{ width: "60px" }}
                        type="number"
                        step="1"
                        value={oneWayTime}
                        onChange={(e) => {
                            SetOneWayTime(e.target.value);
                            callSet({ value: e.target.value, functionName: "SetOneWayTime", objectPath });
                        }}
                    />
                </div>
                <div>
                    <button onClick={() => {
                        callSet({ value: 1, functionName: "LEFT_RIGHT_ONEWAY", objectPath });
                    }}>LEFT_RIGHT_ONEWAY</button>
                </div>

                <div>
                    <button onClick={() => {
                        callSet({ value: 1, functionName: "FRONT_BACK_ONEWAY", objectPath });
                    }}>FRONT_BACK_ONEWAY</button>
                </div>
            </div>
        </>
    );
};

export default Cam;
