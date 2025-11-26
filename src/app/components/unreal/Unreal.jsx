import React, { useState } from 'react'
import Plate from './Plate';

const Unreal = () => {
    const [worldX, setWorldX] = useState(0)
    const [worldY, setWorldY] = useState(0)
    const [worldZ, setWorldZ] = useState(0)
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
                    Parameters: { float: parseFloat(value) },
                    GenerateTransaction: true,
                }),
            });
        } catch (err) {
            console.error("Error:", err.message)
        }
    }

    return (
        <>
            <div style={{ display: 'flex' }}>
                <div style={{ border: '1px solid red' }}>

                    World
                    <div>

                        <label htmlFor="worldX">Set X:</label>
                        <input
                            style={{ width: "60px" }}
                            type="number"
                            step="1"
                            value={worldX}
                            onChange={(e) => {
                                setWorldX(e.target.value);
                                callSet({ value: e.target.value, functionName: "SetX", objectPath: "/Game/000_wTV_AR/Maps/UEDPIE_0_COMPOSITING_LEVEL_LevelInstance_1.COMPOSITING_LEVEL:PersistentLevel.RWR__C_3" });
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
                                callSet({ value: e.target.value, functionName: "SetY", objectPath: "/Game/000_wTV_AR/Maps/UEDPIE_0_COMPOSITING_LEVEL_LevelInstance_1.COMPOSITING_LEVEL:PersistentLevel.RWR__C_3" });
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
                                callSet({ value: e.target.value, functionName: "SetZ", objectPath: "/Game/000_wTV_AR/Maps/UEDPIE_0_COMPOSITING_LEVEL_LevelInstance_1.COMPOSITING_LEVEL:PersistentLevel.RWR__C_3" });
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
                                callSet({ value: e.target.value, functionName: "SetRotZ", objectPath: "/Game/000_wTV_AR/Maps/UEDPIE_0_COMPOSITING_LEVEL_LevelInstance_1.COMPOSITING_LEVEL:PersistentLevel.RWR__C_3" });
                            }}
                        />
                    </div>
                </div>
                <div style={{ border: '1px solid red' }}>


                    Plate1  <Plate objectPath={"/Game/000_wTV_AR/Maps/UEDPIE_0_COMPOSITING_LEVEL_LevelInstance_1.COMPOSITING_LEVEL:PersistentLevel.SelectiveVisibilityInputFeedPlane_C_1"} />

                </div>
                <div style={{ border: '1px solid red' }}>
                    Plate2 <Plate objectPath={"/Game/000_wTV_AR/Maps/UEDPIE_0_COMPOSITING_LEVEL_LevelInstance_1.COMPOSITING_LEVEL:PersistentLevel.SelectiveVisibilityInputFeedPlane_C_2"} />

                </div>

                <div style={{ border: '1px solid red' }}>
                    Plate3  <Plate objectPath={"/Game/000_wTV_AR/Maps/UEDPIE_0_COMPOSITING_LEVEL_LevelInstance_1.COMPOSITING_LEVEL:PersistentLevel.SelectiveVisibilityInputFeedPlane_C_3"} />
                </div>

                <div style={{ border: '1px solid red' }}>
                    Plate4  <Plate objectPath={"/Game/000_wTV_AR/Maps/UEDPIE_0_COMPOSITING_LEVEL_LevelInstance_1.COMPOSITING_LEVEL:PersistentLevel.SelectiveVisibilityInputFeedPlane_C_0"} />
                </div>

            </div>

        </>
    );
};

export default Unreal;
