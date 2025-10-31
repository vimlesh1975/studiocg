'use client'

import React, { useState, useRef } from 'react'
import { iniBreakingNews } from './hockeyData'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { VscMove } from "react-icons/vsc";
import { v4 as uuidv4 } from 'uuid';
import Timer from './Timer';
import { playwithtimer } from '../lib/common';

import { generalFileName, saveFile } from './common'

const vTrailingSpace = 0.1;
const project = "ddnrcs";

const intervalGeneral = 5; //seconds
const intervalTwoliner = 10; //seconds
const intervalticker = 3; //seconds

const ScrollBreakingNewsClock = () => {

    const [horizontalSpeed, setHorizontalSpeed] = useState(0.01);
    const [ltr, setLtr] = useState(false);
    const [playerList1, setPlayerList1] = useState(iniBreakingNews);
    const [delemeter, setDelemeter] = useState('⏺️')
    const [tickerRunning, setTickerRunning] = useState(false);
    const indexRefTicker = useRef(1);

    const onDragEnd1 = (result) => {
        const aa = [...playerList1]
        if (result.destination != null) {
            aa.splice(result.destination?.index, 0, aa.splice(result.source?.index, 1)[0])
            setPlayerList1(aa);
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
    const addPage = e => {
        const aa = [...playerList1]
        aa.splice(parseInt(e.target.getAttribute('key1')) + 1, 0, { id: uuidv4(), data1: '', use1: false });
        setPlayerList1(aa);

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

    const playticker = () => {
        indexRefTicker.current = 1;
        const exportValues = {
            vSpeed: `${horizontalSpeed}`,
            vStart: true,
            vStackCount: "1",
            // vStackSize: 1,
            vReset: true,
            tText: '',
            tScroll: `{ 'Group1': [{ 'vLeadingSpace':'0', 'vTrailingSpace':'${vTrailingSpace}', 'tText': '${playerList1[0].data1}' }] }`,
        }
        fetch("/api/playwithexportedvalues", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                project: 'ddnrcs',
                scene: 'vimlesh_ticker',
                timeline: 'In',
                slot: "1",
                exportedvalues: Object.entries(exportValues).map(([name, value]) => ({ name, value }))
            })
        })
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
        setTickerRunning(false);

    }


    const playBreakingSmallTicker = async () => {
        const scripts = playerList1.map(row => row.data1.split("$$$$").map(s => s.replace(/\s+/g, " ").trim()));

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
                setTickerRunning(false);
            }}
            >
                🧹 Unload All Scenes</button>
            <div style={{ display: 'flex1', border: '3px solid red' }}>
                <div>
                    <button onClick={() => {
                        playticker();
                        setTickerRunning(true);
                    }}>Play</button>
                    {tickerRunning && (
                        <Timer
                            interval={2000}
                            callback={async () => {
                                const currentItem = playerList1[indexRefTicker.current];
                                if (currentItem) {
                                    const aa = `SCENE "ddnrcs/vimlesh_ticker" Export "tScroll" SetValue "{'Group1':[{'vLeadingSpace':'0','vTrailingSpace':'${vTrailingSpace}','tText':'${currentItem.data1}'}]}"`;

                                    await fetch("/api/sendCommand", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ command: aa }),
                                    });
                                }
                                indexRefTicker.current = (indexRefTicker.current + 1) % playerList1.length;
                            }}
                        />
                    )}

                    S:
                    <input
                        style={{ width: "60px" }}
                        onChange={(e) => onhorizontalSpeedChange(e)}
                        type="number"
                        min="-5"
                        max="5"
                        step="0.01"
                        value={horizontalSpeed}
                    />
                    <button onClick={onStopTicker}> Stop Ticker</button>
                    <button onClick={playBreakingSmallTicker}> Play BreakingSmallTicker</button>
                    <button onClick={stopplayBreakingSmallTicker}> Stop BreakingSmallTicker</button>

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
                                <td title='Check for Left to Right scroll'>
                                    <span> LTR:</span>{" "}
                                    <input
                                        type="checkbox"
                                        checked={ltr}
                                        onChange={() => setLtr((val) => !val)}
                                    />
                                </td>
                                <td>
                                    <label>
                                        <img src={playerList1[0]?.delemeterLogo} alt='' width='20' height='20' style={{ border: '1px solid red' }} />
                                        <input type="file" onChange={e => {
                                            var reader = new FileReader();
                                            reader.onloadend = () => {
                                                const aa = [...playerList1];
                                                aa[0] = { ...aa[0], delemeterLogo: reader.result };
                                                setPlayerList1(aa);
                                                // setNewplayerList1(aa)
                                            }
                                            reader.readAsDataURL(e.target.files[0]);
                                        }} style={{ display: 'none' }} />
                                    </label>
                                </td>
                                <td> <button onClick={() => {
                                    const updateddelemeterlogo = playerList1.map((val, i) => ({ ...val, delemeterLogo: playerList1[0].delemeterLogo }));
                                    setPlayerList1(updateddelemeterlogo);
                                }}>Set all logo as first logo</button>

                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>
            {/* <button style={{ display: (isEqual(newplayerList1, playerList1)) ? 'none' : 'inline', backgroundColor: 'red' }} onClick={updateplayerList1}>Update Data</button> */}
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

                                                                <td>
                                                                    <label>
                                                                        <img src={val.delemeterLogo} alt='' width='20' height='20' style={{ border: '1px solid red' }} />
                                                                        <input type="file" onChange={e => {
                                                                            var reader = new FileReader();
                                                                            reader.onloadend = () => {
                                                                                const aa = [...playerList1];
                                                                                aa[i] = { ...aa[i], delemeterLogo: reader.result };
                                                                                setPlayerList1(aa);
                                                                                // setNewplayerList1(aa)
                                                                            }
                                                                            reader.readAsDataURL(e.target.files[0]);
                                                                        }} style={{ display: 'none' }} />
                                                                    </label>
                                                                </td>
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
            </div>
        </div>
    )
}

export default ScrollBreakingNewsClock