import React, { useState } from 'react'

const Plate = ({ objectPath }) => {
    const [worldX, setWorldX] = useState(0)
    const [worldY, setWorldY] = useState(0)
    const [worldZ, setWorldZ] = useState(0)
    const [worldRotX, setWorldRotX] = useState(0)
    const [worldRotY, setWorldRotY] = useState(0)
    const [worldRotZ, setWorldRotZ] = useState(0)

    async function callSet({ value, functionName, objectPath }) {
        console.log("Sending:", value)

        try {
            await fetch("/api/unreal/remote/object/call", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    objectPath,
                    functionName,
                    Parameters: { Value: parseFloat(value) },
                    GenerateTransaction: true,
                }),
            });
        } catch (err) {
            console.error("Error:", err.message)
        }
    }

    return (
        <>
            <div>
                <label htmlFor="worldX">Set X:</label>
                <input
                    style={{ width: "60px" }}
                    type="number"
                    step="1"
                    value={worldX}
                    onChange={(e) => {
                        setWorldX(e.target.value);
                        callSet({ value: e.target.value, functionName: "Set X", objectPath });
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
                        callSet({ value: e.target.value, functionName: "Set Y", objectPath });
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
                        callSet({ value: e.target.value, functionName: "Set Z", objectPath });
                    }}
                />
            </div>

            <div>
                <label htmlFor="worldrotX">Set ROT X:</label>
                <input
                    style={{ width: "60px" }}
                    type="number"
                    step="1"
                    value={worldRotX}
                    onChange={(e) => {
                        setWorldRotX(e.target.value);
                        callSet({ value: e.target.value, functionName: "SET ROT X", objectPath });
                    }}
                />
            </div>

            <div>
                <label htmlFor="worldrotY">Set ROT Y:</label>
                <input
                    style={{ width: "60px" }}
                    type="number"
                    step="1"
                    value={worldRotY}
                    onChange={(e) => {
                        setWorldRotY(e.target.value);
                        callSet({ value: e.target.value, functionName: "SET ROT Y", objectPath });
                    }}
                />
            </div>

            <div>
                <label htmlFor="worldrotZ">Set ROT Z:</label>
                <input
                    style={{ width: "60px" }}
                    type="number"
                    step="1"
                    value={worldRotZ}
                    onChange={(e) => {
                        setWorldRotZ(e.target.value);
                        callSet({ value: e.target.value, functionName: "SET ROT Z", objectPath });
                    }}
                />
            </div>
        </>
    );
};

export default Plate;
