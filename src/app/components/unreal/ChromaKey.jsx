import React, { useState } from 'react'

const ChromaKey = ({ Heading, objectPath }) => {

    const [BlackClip, setBlackClip] = useState(0)
    const [WhiteClip, setWhiteClip] = useState(100)
    const [PreBlurKernalSize, setPreBlurKernalSize] = useState(1.359)
    const [PreBlurSamples, setPreBlurSamples] = useState(8)
    const [AlphaThreshold, setAlphaThreshold] = useState(0.376)
    const [AlphaOffset, setAlphaOffset] = useState(0.2277)
    const [RedWeight, setRedWeight] = useState(0.847244)
    const [BlueWeight, setBlueWeight] = useState(0.5)

    const options = [
        { name: "PLATE1", value: 1 },
        { name: "PLATE2", value: 2 },
        { name: "PLATE3", value: 3 },
        { name: "PLATE4", value: 0 },
        { name: "PLATE1_Tracked", value: "tracked" }
    ];
    const [selected, setSelected] = useState(1);


    async function callSet({ value, functionName, objectPath }) {
        console.log("Sending:", value)

        try {
            const res = await fetch("/api/unreal/remote/object/call", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    objectPath,
                    functionName,
                    Parameters: { Value: parseFloat(value) },
                    GenerateTransaction: true,
                }),
            });

            const json = await res.json().catch(() => null);
            console.log("API replied:", res.status, json);

        } catch (err) {
            console.error("Error:", err.message)
        }
    }


    return (<>
        <div>
            <h3> {Heading}</h3>

            <label>Select Plate: </label>

            <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
            >
                {options.map((item, index) => (
                    <option key={index} value={item.value}>
                        {item.name}
                    </option>
                ))}
            </select>

        </div>
        <div>

            <div>
                <label>BlackClip</label>
                <input
                    style={{ width: 70 }}
                    type="number"
                    step="0.0001"
                    value={BlackClip}
                    onChange={(e) => {
                        setBlackClip(e.target.value);
                        callSet({
                            value: e.target.value, functionName: "SetBlackClip", objectPath: (selected !== 'tracked') ? (objectPath + selected) :
                                (objectPath.split("PersistentLevel")[0] + "PersistentLevel.media_plate1_1")
                        });
                    }}
                />
            </div>
            <div>
                <label>WhiteClip</label>
                <input
                    style={{ width: 70 }}
                    type="number"
                    step="0.0001"
                    value={WhiteClip}
                    onChange={(e) => {
                        setWhiteClip(e.target.value);
                        callSet({
                            value: e.target.value, functionName: "SetWhiteClip", objectPath: (selected !== 'tracked') ? (objectPath + selected) :
                                (objectPath.split("PersistentLevel")[0] + "PersistentLevel.media_plate1_1")
                        });
                    }}
                />
            </div>
            <div>
                <label>PreBlurKernalSize</label>
                <input
                    style={{ width: 70 }}
                    type="number"
                    step="0.0001"
                    value={PreBlurKernalSize}
                    onChange={(e) => {
                        setPreBlurKernalSize(e.target.value);
                        callSet({
                            value: e.target.value, functionName: "SetPreBlurKernalSize", objectPath: (selected !== 'tracked') ? (objectPath + selected) :
                                (objectPath.split("PersistentLevel")[0] + "PersistentLevel.media_plate1_1")
                        });
                    }}
                />
            </div>
            <div>
                <label>PreBlurSamples</label>
                <input
                    style={{ width: 70 }}
                    type="number"
                    step="0.0001"
                    value={PreBlurSamples}
                    onChange={(e) => {
                        setPreBlurSamples(e.target.value);
                        callSet({
                            value: e.target.value, functionName: "SetPreBlurSamples", objectPath: (selected !== 'tracked') ? (objectPath + selected) :
                                (objectPath.split("PersistentLevel")[0] + "PersistentLevel.media_plate1_1")
                        });
                    }}
                />
            </div>

            <div>
                <label>AlphaThreshold</label>
                <input
                    style={{ width: 70 }}
                    type="number"
                    step="0.0001"
                    value={AlphaThreshold}
                    onChange={(e) => {
                        setAlphaThreshold(e.target.value);
                        callSet({
                            value: e.target.value, functionName: "SetAlphaThreshold", objectPath: (selected !== 'tracked') ? (objectPath + selected) :
                                (objectPath.split("PersistentLevel")[0] + "PersistentLevel.media_plate1_1")
                        });
                    }}
                />
            </div>
            <div>
                <label>AlphaOffset</label>
                <input
                    style={{ width: 70 }}
                    type="number"
                    step="0.0001"
                    value={AlphaOffset}
                    onChange={(e) => {
                        setAlphaOffset(e.target.value);
                        callSet({
                            value: e.target.value, functionName: "SetAlphaOffset", objectPath: (selected !== 'tracked') ? (objectPath + selected) :
                                (objectPath.split("PersistentLevel")[0] + "PersistentLevel.media_plate1_1")
                        });
                    }}
                />
            </div>

            <div>
                <label>RedWeight</label>
                <input
                    style={{ width: 70 }}
                    type="number"
                    step="0.0001"
                    value={RedWeight}
                    onChange={(e) => {
                        setRedWeight(e.target.value);
                        callSet({
                            value: e.target.value, functionName: "SetRedWeight", objectPath: (selected !== 'tracked') ? (objectPath + selected) :
                                (objectPath.split("PersistentLevel")[0] + "PersistentLevel.media_plate1_1")
                        });
                    }}
                />
            </div>

            <div>
                <label>BlueWeight</label>
                <input
                    style={{ width: 70 }}
                    type="number"
                    step="0.0001"
                    value={BlueWeight}
                    onChange={(e) => {
                        setBlueWeight(e.target.value);
                        callSet({
                            value: e.target.value, functionName: "SetBlueWeight", objectPath: (selected !== 'tracked') ? (objectPath + selected) :
                                (objectPath.split("PersistentLevel")[0] + "PersistentLevel.media_plate1_1")
                        });
                    }}
                />
            </div>

        </div>
    </>)
}

export default ChromaKey
