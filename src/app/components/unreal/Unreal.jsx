import React, { useState } from 'react'
import Plate from './Plate';
import Cam from './Cam';
import Worldlocation from './Worldlocation';
import Genesis from './Genesis';
import ChromaKey from './ChromaKey';

const intance = 1
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
                    <Worldlocation objectPath={`/Game/000_wTV_AR/Maps/${editmode}COMPOSITING_LEVEL_LevelInstance_${intance}.COMPOSITING_LEVEL:PersistentLevel.RWR__C_3`} />
                </div>
                <div style={{ border: '1px solid red' }}>
                    Plate1  <Plate objectPath={`/Game/000_wTV_AR/Maps/${editmode}COMPOSITING_LEVEL_LevelInstance_${intance}.COMPOSITING_LEVEL:PersistentLevel.SelectiveVisibilityInputFeedPlane_C_1`} />
                </div>
                <div style={{ border: '1px solid red' }}>
                    Plate2 <Plate objectPath={`/Game/000_wTV_AR/Maps/${editmode}COMPOSITING_LEVEL_LevelInstance_${intance}.COMPOSITING_LEVEL:PersistentLevel.SelectiveVisibilityInputFeedPlane_C_2`} />
                </div>
                <div style={{ border: '1px solid red' }}>
                    Plate3  <Plate objectPath={`/Game/000_wTV_AR/Maps/${editmode}COMPOSITING_LEVEL_LevelInstance_${intance}.COMPOSITING_LEVEL:PersistentLevel.SelectiveVisibilityInputFeedPlane_C_3`} />
                </div>
                <div style={{ border: '1px solid red' }}>
                    Plate4  <Plate objectPath={`/Game/000_wTV_AR/Maps/${editmode}COMPOSITING_LEVEL_LevelInstance_${intance}.COMPOSITING_LEVEL:PersistentLevel.SelectiveVisibilityInputFeedPlane_C_0`} />
                </div>
                <div style={{ border: '1px solid red' }}>
                    ChromaKey:  <ChromaKey objectPath={`/Game/000_wTV_AR/Maps/${editmode}COMPOSITING_LEVEL_LevelInstance_${intance}.COMPOSITING_LEVEL:PersistentLevel.SelectiveVisibilityInputFeedPlane_C_`} />
                </div>
            </div>
            <div style={{ display: 'flex' }}>
                <div style={{ border: '1px solid red' }}>
                    Cam 1  <Cam objectPath={`/Game/000_wTV_AR/Maps/${editmode}COMPOSITING_LEVEL_LevelInstance_${intance}.COMPOSITING_LEVEL:PersistentLevel.Trackedpawn_C_1`} />
                </div>
                <div style={{ border: '1px solid red' }}>
                    Cam 2  <Cam objectPath={`/Game/000_wTV_AR/Maps/${editmode}COMPOSITING_LEVEL_LevelInstance_${intance}.COMPOSITING_LEVEL:PersistentLevel.Trackedpawn_C_2`} />
                </div>
                <div style={{ border: '1px solid red' }}>
                    Cam 3 <Cam objectPath={`/Game/000_wTV_AR/Maps/${editmode}COMPOSITING_LEVEL_LevelInstance_${intance}.COMPOSITING_LEVEL:PersistentLevel.Trackedpawn_C_3`} />
                </div>
            </div>
            <div>
                <Genesis />
            </div>


        </>
    );
};

export default Unreal;
