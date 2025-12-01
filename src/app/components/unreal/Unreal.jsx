import React, { useState } from 'react'
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

    return (
        <>
            {/* <div>
            <input checked={editmode} type='checkbox' onChange={(e) => {
                                                                    setEditmode("UEDPIE_0_")
                                                                }
                                                                } />
        </div> */}
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
