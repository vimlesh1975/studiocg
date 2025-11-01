'use client'

import React, { useState } from 'react'
import { iniBreakingNews, iniBreakingNews2 } from './hockeyData'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { VscMove } from "react-icons/vsc";
import { v4 as uuidv4 } from 'uuid';
import { playwithtimer, playScene } from '../lib/common';

import { generalFileName, saveFile } from './common'
const project = "ddnrcs";
const intervalGeneral = 1; //seconds
const ScrollBreakingNewsClock = () => {

    const [horizontalSpeed, setHorizontalSpeed] = useState(0.01);
    const [playerList1, setPlayerList1] = useState(iniBreakingNews);
    const [playerList2, setPlayerList2] = useState(iniBreakingNews2);
    const [delemeter, setDelemeter] = useState('*')

    const [yPositiondate, setyPositiondate] = useState(0.00);

    const playClock = async () => {
        await playScene({ project, scene: 'vimlesh_clock1', slot: "7", exportValues: {} });

        await setYPosition('vimlesh_clock1', yPositiondate);
    }
    const stopClock = () => {
        stopScene({ project, scene: 'vimlesh_clock1' });
    }

    const onDragEnd1 = (result) => {
        const aa = [...playerList1]
        if (result.destination != null) {
            aa.splice(result.destination?.index, 0, aa.splice(result.source?.index, 1)[0])
            setPlayerList1(aa);
        }
    }

    const onDragEnd2 = (result) => {
        const aa = [...playerList2]
        if (result.destination != null) {
            aa.splice(result.destination?.index, 0, aa.splice(result.source?.index, 1)[0])
            setPlayerList2(aa);
        }
    }

    const deletePage = e => {
        if (playerList1.length === 1) {
            return
        }
        const aa = [...playerList1]
        aa.splice(parseInt(e.target.getAttribute('key1')), 1);
        setPlayerList1(aa);
    }

    const deletePage2 = e => {
        if (playerList2.length === 1) {
            return
        }
        const aa = [...playerList2]
        aa.splice(parseInt(e.target.getAttribute('key1')), 1);
        setPlayerList2(aa);
    }

    const addPage = e => {
        const aa = [...playerList1]
        aa.splice(parseInt(e.target.getAttribute('key1')) + 1, 0, { id: uuidv4(), data1: '', use1: false });
        setPlayerList1(aa);
    }
    const addPage2 = e => {
        const aa = [...playerList2]
        aa.splice(parseInt(e.target.getAttribute('key1')) + 1, 0, { id: uuidv4(), data1: '', use1: false });
        setPlayerList2(aa);
    }
    const scrollFileSaveAs = () => {
        var aa = ''
        playerList1.forEach(val => {
            aa += JSON.stringify({ id: val.id, data1: val.data1, use1: val.use1, delemeterLogo: val.delemeterLogo }) + '\r\n'
        });
        const data = new Blob([aa], { type: 'text/plain' });

        const options = {
            fileExtension: '.txt',
            suggestedName: 'Scroll_' + generalFileName(),
            types: [
                {
                    description: 'text Files',
                    accept: {
                        'text/plain': ['.txt'],
                    },
                },
            ],
        };
        saveFile(options, data)
    }
    let fileReader;

    const handleFileChosen = (file) => {
        if (file) {
            fileReader = new FileReader();
            fileReader.onloadend = handleFileRead;
            fileReader.readAsText(file);
        }
    }
    const handleFileRead = async () => {

        const content = fileReader.result;
        const aa = content.split('\r\n');
        aa.splice(-1);
        const updatedcanvasList = aa.map(element => {
            const cc = JSON.parse(element);
            return { id: cc.id, data1: cc.data1, use1: cc.use1, delemeterLogo: cc.delemeterLogo };
        });

        setPlayerList1(updatedcanvasList);
    };

    const playticker = async () => {
        const scripts = playerList1.filter(row => row.use1).map(row => row.data1.split("$$$$").map(s => s.replace(/\s+/g, " ").trim() + "    " + delemeter));
        const exportValues = {
            vSpeed: `${horizontalSpeed}`,
            vStart: true,
            vStackCount: "1",
            vReset: true,
            tText: '',
        }
        const params = [
            { interval_seconds: intervalGeneral },
            { messages: scripts }
        ]
        await playwithtimer({ project, scene: "vimlesh_ticker", timeline: "In", slot: "1", exportValues, functionName: "play_text_sequence", params })
    }


    const onhorizontalSpeedChange = async (e) => {
        setHorizontalSpeed(e.target.value);
        const res = await fetch("/api/sendCommand", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ command: `SCENE "ddnrcs/vimlesh_ticker" Export "vSpeed" SetValue "${e.target.value}"` })
        })
    }

    const onStopTicker = async () => {
        fetch("/api/timeline", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ project: 'ddnrcs', scene: 'vimlesh_ticker', timeline: "Out" })
        })
    }


    const playBreakingSmallTicker = async () => {
        const scripts = playerList2.filter(row => row.use1).map(row => row.data1.split("$$$$").map(s => s.replace(/\s+/g, " ").trim()));

        const exportValues = { tTextA: `` }
        const params = [
            { interval_seconds: intervalGeneral },
            { messages: scripts }
        ]
        await playwithtimer({ project, scene: "BreakingSmall_Ticker", timeline: "In", slot: "5", exportValues, functionName: "play_text_sequence", params })
    }
    const stopplayBreakingSmallTicker = () => {
        fetch("/api/timeline", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ project: 'ddnrcs', scene: 'BreakingSmall_Ticker', timeline: "Out" })
        })
    }


    return (
        <div>
            <button style={{ backgroundColor: 'darkred', color: 'white' }} onClick={() => {
                fetch("/api/unloadAllScenes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });
            }}
            >
                🧹 Unload All Scenes</button>
            <div style={{ display: 'flex1', border: '3px solid red' }}>
                <div >
                    <div>
                        <button onClick={() => {
                            playticker();
                        }}>Play Scroll</button>

                        Speed:
                        <input
                            style={{ width: "60px" }}
                            onChange={(e) => onhorizontalSpeedChange(e)}
                            type="number"
                            min="-5"
                            max="5"
                            step="0.01"
                            value={horizontalSpeed}
                        />
                        <button onClick={onStopTicker}> Stop Scroll</button>
                    </div>
                    <div style={{ border: '1px solid red' }}>
                        <table border='1px solid red'>
                            <tbody >
                                <tr>
                                    <td><button onClick={scrollFileSaveAs}>Save</button></td>
                                    <td><span>Open File:</span><input
                                        type='file'
                                        id='file'
                                        className='input-file'
                                        accept='.txt'
                                        onChange={e => {
                                            console.log(e.target.files[0])
                                            handleFileChosen(e.target.files[0]);
                                        }}
                                    /></td>
                                    <td>Delemeter for scroll text</td>
                                    <td><input style={{ width: 40, textAlign: 'center' }} onChange={(e) => setDelemeter(e.target.value)} value={delemeter} /></td>

                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div style={{ display: 'flex', minwidth: 650, margin: 20 }}>
                    <div style={{ backgroundColor: 'grey', height: 300, width: 800, overflow: 'auto' }}>
                        <DragDropContext onDragEnd={onDragEnd1}>
                            <Droppable droppableId="droppable-1" type="PERSON1">
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={{ backgroundColor: snapshot.isDraggingOver ? 'yellow' : 'yellowgreen' }}
                                        {...provided.droppableProps}
                                    >
                                        <table >
                                            <tbody>
                                                {playerList1.map((val, i) => {
                                                    return (
                                                        <Draggable draggableId={val.id} key={val.id} index={i}>
                                                            {(provided, snapshot) => (
                                                                <tr
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    style={{
                                                                        ...provided.draggableProps.style,
                                                                        backgroundColor: snapshot.isDragging ? 'red' : 'white',
                                                                        boxShadow: snapshot.isDragging ? "0 0 .4rem #666" : "none",
                                                                        // margin: '10px'
                                                                    }}
                                                                >
                                                                    <td style={{ textAlign: 'center' }}>{i}</td>
                                                                    <td {...provided.dragHandleProps}><VscMove /></td>


                                                                    <td style={{ minWidth: 300 }}><input style={{ border: 'none', minWidth: 620 }} type='text' value={val.data1}
                                                                        onChange={e => {
                                                                            const updatednewplayerList1 = [...playerList1]
                                                                            updatednewplayerList1[i] = { ...updatednewplayerList1[i], data1: e.target.value };
                                                                            setPlayerList1(updatednewplayerList1)
                                                                        }}
                                                                    />
                                                                    </td>
                                                                    <td><input checked={val.use1} type='checkbox' onChange={(e) => {
                                                                        const updatednewplayerList1 = [...playerList1]
                                                                        updatednewplayerList1[i] = { ...updatednewplayerList1[i], use1: e.target.checked };
                                                                        setPlayerList1(updatednewplayerList1)
                                                                    }
                                                                    } /></td>
                                                                    <td><button key1={i} onClick={(e) => deletePage(e)}>-</button></td>
                                                                    <td><button key1={i} onClick={(e) => addPage(e)}>+</button></td>
                                                                </tr>
                                                            )
                                                            }
                                                        </Draggable>
                                                    )
                                                })}
                                                {provided.placeholder}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                    <div style={{ border: '3px solid black' }}>
                        <h3>date and Time</h3>
                        <button onClick={playClock}>Play</button>
                        <button onClick={stopClock}>Stop</button>
                        <br /> set Y Position <input type="Number" style={{ width: 60 }} step={0.01} value={yPositiondate} onChange={async (e) => {
                            setyPositiondate(e.target.value);
                            await setYPosition('vimlesh_clock1', e.target.value);
                        }} />
                    </div>
                </div>
            </div>


            <div style={{ border: '3px solid blue' }}>
                <div>
                    <button onClick={playBreakingSmallTicker}> Play Breaking News</button>
                    <button onClick={stopplayBreakingSmallTicker}> Stop Breaking News</button>
                </div>
                <div style={{ display: 'flex', minwidth: 1900, margin: 20 }}>
                    <div style={{ backgroundColor: 'grey', height: 300, width: 1900, overflow: 'auto' }}>
                        <DragDropContext onDragEnd={onDragEnd2}>
                            <Droppable droppableId="droppable-2" type="PERSON2">
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={{ backgroundColor: snapshot.isDraggingOver ? 'yellow' : 'yellowgreen' }}
                                        {...provided.droppableProps}
                                    >
                                        <table >
                                            <tbody>
                                                {playerList2.map((val, i) => {
                                                    return (
                                                        <Draggable draggableId={val.id} key={val.id} index={i}>
                                                            {(provided, snapshot) => (
                                                                <tr
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    style={{
                                                                        ...provided.draggableProps.style,
                                                                        backgroundColor: snapshot.isDragging ? 'red' : 'white',
                                                                        boxShadow: snapshot.isDragging ? "0 0 .4rem #666" : "none",
                                                                        // margin: '10px'
                                                                    }}
                                                                >
                                                                    <td style={{ textAlign: 'center' }}>{i}</td>
                                                                    <td {...provided.dragHandleProps}><VscMove /></td>

                                                                    <td style={{ minWidth: 1700 }}><input style={{ border: 'none', minWidth: 1700 }} type='text' value={val.data1}
                                                                        onChange={e => {
                                                                            const updatednewplayerList1 = [...playerList2]
                                                                            updatednewplayerList1[i] = { ...updatednewplayerList1[i], data1: e.target.value };
                                                                            setPlayerList2(updatednewplayerList1)
                                                                        }}
                                                                    />
                                                                    </td>
                                                                    <td><input checked={val.use1} type='checkbox' onChange={(e) => {
                                                                        const updatednewplayerList1 = [...playerList2]
                                                                        updatednewplayerList1[i] = { ...updatednewplayerList1[i], use1: e.target.checked };
                                                                        setPlayerList2(updatednewplayerList1)
                                                                    }
                                                                    } /></td>
                                                                    <td><button key1={i} onClick={(e) => deletePage2(e)}>-</button></td>
                                                                    <td><button key1={i} onClick={(e) => addPage2(e)}>+</button></td>
                                                                </tr>
                                                            )
                                                            }
                                                        </Draggable>
                                                    )
                                                })}
                                                {provided.placeholder}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default ScrollBreakingNewsClock