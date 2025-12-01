import React, { useState, useMemo } from 'react'
import Plate from './Plate';
import Cam from './Cam';
import Worldlocation from './Worldlocation';
import Genesis from './Genesis';
import ChromaKey from './ChromaKey';

const instance = 1
// const editmode="UEDPIE_0_"
// const editmode = ""

const Unreal = () => {
    // const [editmode, setEditmode] = useState("UEDPIE_0_");
    const [editmode, setEditmode] = useState("");
    const [editmodebool, setEditmodebool] = useState(false);
    const [labels, setLabels] = useState(null);


    function LabelCombo({ returnValue }) {
        // Build options only once
        const options = useMemo(
            () =>
                Object.entries(returnValue).map(([path, label]) => ({
                    value: path,   // what you send back to Unreal
                    label,        // what the user sees
                })),
            [returnValue]
        );

        // Default selected: first option whose label is "PLATE1"
        const defaultOption =
            options.find(o => o.label === "PLATE1") || options[0];

        const [selectedValue, setSelectedValue] = useState(
            defaultOption ? defaultOption.value : ""
        );

        return (
            <select
                value={selectedValue}
                onChange={e => setSelectedValue(e.target.value)}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        );
    }



    return (
        <>
            <div>
                Edit Mode:   <input checked={editmodebool} type='checkbox' onChange={(e) => {
                    setEditmodebool(val => !val);
                    setEditmode(e.target.checked ? "UEDPIE_0_" : "")
                }
                } />
                {editmode}

                <button onClick={async () => {
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
                        console.log(json.unreal.ReturnValue)
                        setEditmodebool(json.unreal.ReturnValue)
                        setEditmode(json.unreal.ReturnValue ? "UEDPIE_0_" : "")

                        // setResult(JSON.stringify(json));
                    } catch (err) {
                        // setResult("Error: " + err.message);
                    }
                }}>Get Mode</button>

                <button onClick={async () => {
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
                        console.log(json.unreal.ReturnValue)

                        // `res` is the JSON you showed
                        const returnValue = json.unreal.ReturnValue;
                        setLabels(returnValue)

                        // All labels as an array: ["UWR_Cone", "COMP1", "PLATE1", ...]
                        const labels = Object.values(returnValue);

                        // If you also want to keep the UObject path with each label:
                        const options = Object.entries(returnValue).map(([path, label]) => ({
                            path,   // key
                            label,  // value
                        }));



                        // setResult(JSON.stringify(json));
                    } catch (err) {
                        // setResult("Error: " + err.message);
                    }
                }}>Get Labels and Paths</button>

                {labels && < LabelCombo returnValue={labels} />}

            </div>
            <div style={{ display: 'flex' }}>
                <div style={{ border: '1px solid red' }}>
                    <Worldlocation Heading={'World'} objectPath={`/Game/000_wTV_AR/Maps/${editmode}COMPOSITING_LEVEL_LevelInstance_${instance}.COMPOSITING_LEVEL:PersistentLevel.RWR__C_3`} />
                </div>
                <div style={{ border: '1px solid red' }}>
                    <Plate Heading={'Plate1'} objectPath={`/Game/000_wTV_AR/Maps/${editmode}COMPOSITING_LEVEL_LevelInstance_${instance}.COMPOSITING_LEVEL:PersistentLevel.SelectiveVisibilityInputFeedPlane_C_1`} />
                </div>
                <div style={{ border: '1px solid red' }}>
                    <Plate Heading={'Plate2'} objectPath={`/Game/000_wTV_AR/Maps/${editmode}COMPOSITING_LEVEL_LevelInstance_${instance}.COMPOSITING_LEVEL:PersistentLevel.SelectiveVisibilityInputFeedPlane_C_2`} />
                </div>
                <div style={{ border: '1px solid red' }}>
                    <Plate Heading={'Plate3'} objectPath={`/Game/000_wTV_AR/Maps/${editmode}COMPOSITING_LEVEL_LevelInstance_${instance}.COMPOSITING_LEVEL:PersistentLevel.SelectiveVisibilityInputFeedPlane_C_3`} />
                </div>
                <div style={{ border: '1px solid red' }}>
                    <Plate Heading={'Plate4'} objectPath={`/Game/000_wTV_AR/Maps/${editmode}COMPOSITING_LEVEL_LevelInstance_${instance}.COMPOSITING_LEVEL:PersistentLevel.SelectiveVisibilityInputFeedPlane_C_0`} />
                </div>
                <div style={{ border: '1px solid red' }}>
                    <ChromaKey Heading={'ChromaKey'} objectPath={`/Game/000_wTV_AR/Maps/${editmode}COMPOSITING_LEVEL_LevelInstance_${instance}.COMPOSITING_LEVEL:PersistentLevel.SelectiveVisibilityInputFeedPlane_C_`} />
                </div>
            </div>
            <div style={{ display: 'flex' }}>
                <div style={{ border: '1px solid red' }}>
                    <Cam Heading={'Cam 1'} objectPath={`/Game/000_wTV_AR/Maps/${editmode}COMPOSITING_LEVEL_LevelInstance_${instance}.COMPOSITING_LEVEL:PersistentLevel.Trackedpawn_C_1`} />
                </div>
                <div style={{ border: '1px solid red' }}>
                    <Cam Heading={'Cam 2'} objectPath={`/Game/000_wTV_AR/Maps/${editmode}COMPOSITING_LEVEL_LevelInstance_${instance}.COMPOSITING_LEVEL:PersistentLevel.Trackedpawn_C_2`} />
                </div>
                <div style={{ border: '1px solid red' }}>
                    <Cam Heading={'Cam 3'} objectPath={`/Game/000_wTV_AR/Maps/${editmode}COMPOSITING_LEVEL_LevelInstance_${instance}.COMPOSITING_LEVEL:PersistentLevel.Trackedpawn_C_3`} />
                </div>
            </div>
            <h1>Genesis</h1>
            <div style={{ display: 'flex' }}>

                <div style={{ border: '1px solid red' }}>
                    <Genesis Heading={'Ginat LED'} objectPath={`/Game/DD_STUDIO/MAPS/${editmode}GENESIS_LevelInstance_${instance + 1}.GENESIS:PersistentLevel.StaticMeshActor_392`} />
                </div>

                <div style={{ border: '1px solid red' }}>
                    <Genesis Heading={'Round LED'} objectPath={`/Game/DD_STUDIO/MAPS/${editmode}GENESIS_LevelInstance_${instance + 1}.GENESIS:PersistentLevel.StaticMeshActor_UAID_D843AECFCA8E855F02_1924610275`} />
                </div>

                <div style={{ border: '1px solid red' }}>
                    <Genesis Heading={'Right LED'} objectPath={`/Game/DD_STUDIO/MAPS/${editmode}GENESIS_LevelInstance_${instance + 1}.GENESIS:PersistentLevel.StaticMeshActor_UAID_D843AECFCA8E855F02_1924601255`} />
                </div>
            </div>




        </>
    );
};

export default Unreal;
