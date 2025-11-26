import React, { useState } from 'react'
import Plate from './Plate';
import Cam from './Cam';
import Worldlocation from './Worldlocation';

const intance = 9

const Unreal = () => {

    return (
        <>
            <div style={{ display: 'flex' }}>
                <div style={{ border: '1px solid red' }}>
                    <Worldlocation objectPath={`/Game/000_wTV_AR/Maps/UEDPIE_0_COMPOSITING_LEVEL_LevelInstance_${intance}.COMPOSITING_LEVEL:PersistentLevel.RWR__C_3`} />
                </div>
                <div style={{ border: '1px solid red' }}>
                    Plate1  <Plate objectPath={`/Game/000_wTV_AR/Maps/UEDPIE_0_COMPOSITING_LEVEL_LevelInstance_${intance}.COMPOSITING_LEVEL:PersistentLevel.SelectiveVisibilityInputFeedPlane_C_1`} />
                </div>
                <div style={{ border: '1px solid red' }}>
                    Plate2 <Plate objectPath={`/Game/000_wTV_AR/Maps/UEDPIE_0_COMPOSITING_LEVEL_LevelInstance_${intance}.COMPOSITING_LEVEL:PersistentLevel.SelectiveVisibilityInputFeedPlane_C_2`} />
                </div>
                <div style={{ border: '1px solid red' }}>
                    Plate3  <Plate objectPath={`/Game/000_wTV_AR/Maps/UEDPIE_0_COMPOSITING_LEVEL_LevelInstance_${intance}.COMPOSITING_LEVEL:PersistentLevel.SelectiveVisibilityInputFeedPlane_C_3`} />
                </div>
                <div style={{ border: '1px solid red' }}>
                    Plate4  <Plate objectPath={`/Game/000_wTV_AR/Maps/UEDPIE_0_COMPOSITING_LEVEL_LevelInstance_${intance}.COMPOSITING_LEVEL:PersistentLevel.SelectiveVisibilityInputFeedPlane_C_0`} />
                </div>
            </div>
            <div style={{ display: 'flex' }}>
                <div style={{ border: '1px solid red' }}>
                    Cam 1  <Cam objectPath={`/Game/000_wTV_AR/Maps/UEDPIE_0_COMPOSITING_LEVEL_LevelInstance_${intance}.COMPOSITING_LEVEL:PersistentLevel.Trackedpawn_C_1`} />
                </div>
                <div style={{ border: '1px solid red' }}>
                    Cam 2  <Cam objectPath={`/Game/000_wTV_AR/Maps/UEDPIE_0_COMPOSITING_LEVEL_LevelInstance_${intance}.COMPOSITING_LEVEL:PersistentLevel.Trackedpawn_C_2`} />
                </div>
                <div style={{ border: '1px solid red' }}>
                    Cam 3 <Cam objectPath={`/Game/000_wTV_AR/Maps/UEDPIE_0_COMPOSITING_LEVEL_LevelInstance_${intance}.COMPOSITING_LEVEL:PersistentLevel.Trackedpawn_C_3`} />
                </div>
            </div>



        </>
    );
};

export default Unreal;
