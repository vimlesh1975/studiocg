import React, { useState, useMemo } from 'react'
import Plate from './Plate';
import Cam from './Cam';
import Worldlocation from './Worldlocation';
import Genesis from './Genesis';
import ChromaKey from './ChromaKey';
import VerticalScreen from './VerticalScreen';



// const instance = 3
// const editmode="UEDPIE_0_"
// const editmode = ""

const Unreal = () => {
    // const [editmode, setEditmode] = useState("UEDPIE_0_");
    const [editmode, setEditmode] = useState("");
    const [instance, setInstance] = useState(1);
    // const [editmodebool, setEditmodebool] = useState(false);
    const [labels, setLabels] = useState(null);

    const [selectedValue, setSelectedValue] = useState('')

    const [functions, setFunctions] = useState([]);
    const [selectedfunction, setSelectedfunction] = useState('');

    async function describe({ objectPath }) {
        try {
            const res = await fetch(
                `/api/unreal/remote/object/describe?objectPath=${encodeURIComponent(
                    objectPath
                )}`
            );

            const json = await res.json();
            setFunctions(json.data.Functions)
        } catch (err) {
        }
    }


    function LabelCombo({ returnValue }) {
        const options = useMemo(
            () =>
                Object.entries(returnValue).map(([path, label]) => ({
                    value: path,   // what you send back to Unreal
                    label,        // what the user sees
                })),
            [returnValue]
        );

        return (<>
            <select
                value={selectedValue}
                onChange={(e) => {
                    setSelectedValue(e.target.value);
                    const input = e.target.value;
                    const insert = editmode;
                    const output = input.replace(/(\/maps\/)/i, `$1${insert}`);
                    describe({ objectPath: output })
                }}
            >
                {options.map((opt, i) => (
                    <option key={i} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <div style={{ minWidth: 1200, backgroundColor: 'grey1' }}>
                Path:  {selectedValue}
            </div>

            <div>
                Function:  <select
                    value={selectedfunction}
                    onChange={(e) => {
                        setSelectedfunction(e.target.value);
                    }}
                >
                    {functions.map((opt, i) => (
                        <option key={i} value={opt.Name}>
                            {opt.Name}
                        </option>
                    ))}
                </select>
            </div>

        </>);
    }

    const initialise = async () => {
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
            // setEditmodebool(json.unreal.ReturnValue)
            setEditmode(json.unreal.ReturnValue ? "UEDPIE_0_" : "")

            // setResult(JSON.stringify(json));
        } catch (err) {
            // setResult("Error: " + err.message);
        }

        //get paths
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
            const json = await res.json();
            // console.log(json.unreal.ReturnValue)


            const returnValue = json.unreal.ReturnValue;
            setLabels(returnValue)

            const aa = Object.entries(returnValue).map(([path, label]) => ({
                value: path,   // what you send back to Unreal
                label,        // what the user sees
            }))
            const str = aa[0].value;
            const match = str.match(/_LevelInstance_(\d+)/);
            const number = match ? match[1] : null;
            setInstance(number)
        } catch (err) {
        }
    }

    return (
        <>
            <div>
                <button onClick={initialise}>Initialise</button>
            </div>
            <div>
                Objects:  {labels && < LabelCombo returnValue={labels} />}
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

                <div style={{ border: '1px solid red' }}>
                    <h3>Vertical Screens</h3>
                    <VerticalScreen Heading={1} objectPath={`/Game/DD_STUDIO/MAPS/${editmode}GENESIS_LevelInstance_${instance + 1}.GENESIS:PersistentLevel.StaticMeshActor_UAID_D843AECFCA8ED15402_1234367029`} />
                    <VerticalScreen Heading={2} objectPath={`/Game/DD_STUDIO/MAPS/${editmode}GENESIS_LevelInstance_${instance + 1}.GENESIS:PersistentLevel.StaticMeshActor_402`} />
                    <VerticalScreen Heading={3} objectPath={`/Game/DD_STUDIO/MAPS/${editmode}GENESIS_LevelInstance_${instance + 1}.GENESIS:PersistentLevel.StaticMeshActor_UAID_D843AECFCA8ED15402_1261399031`} />
                    <VerticalScreen Heading={4} objectPath={`/Game/DD_STUDIO/MAPS/${editmode}GENESIS_LevelInstance_${instance + 1}.GENESIS:PersistentLevel.StaticMeshActor_UAID_D843AECFCA8ED15402_1287761033`} />
                    <VerticalScreen Heading={5} objectPath={`/Game/DD_STUDIO/MAPS/${editmode}GENESIS_LevelInstance_${instance + 1}.GENESIS:PersistentLevel.StaticMeshActor_UAID_D843AECFCA8ED15402_1325731037`} />
                    <VerticalScreen Heading={6} objectPath={`/Game/DD_STUDIO/MAPS/${editmode}GENESIS_LevelInstance_${instance + 1}.GENESIS:PersistentLevel.StaticMeshActor_UAID_D843AECFCA8ED15402_1344537039`} />
                </div>
            </div>




        </>
    );
};

export default Unreal;
