'use client'

import React, { useState } from 'react'
import { iniBreakingNews, iniBreakingNews2 } from './hockeyData'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { VscMove } from "react-icons/vsc";
import { v4 as uuidv4 } from 'uuid';
import { playwithtimer, playScene, stopScene, sendCommand } from '../lib/common';

import { generalFileName, saveFile } from './common'
const project = "ddnrcs";
const intervalGeneral = 1; //seconds
const ScrollBreakingNewsClock = () => {

    const [horizontalSpeed, setHorizontalSpeed] = useState(0.015);
    const [playerList1, setPlayerList1] = useState(iniBreakingNews);
    const [playerList2, setPlayerList2] = useState(iniBreakingNews2);
    const [tmrBraekingNews, setTmrBraekingNews] = useState(1000)
    const [headingBraekingNews, setHeadingBreakingNews] = useState('Breaking News')

    const [yPositionscroll, setyPositionscroll] = useState(0.00);
    const [yPositionbreakingNews, setyPositionbreakingNews] = useState(0.00);

    const [yPositionDate, setYPositionDate] = useState(0.00);


    const [xPositionLogo, setXPositionLogo] = useState(0.00);
    const [yPositionLogo, setYPositionLogo] = useState(0.00);
    const [xScaleLogo, setXScaleLogo] = useState(1.00);
    const [yScaleLogo, setYScaleLogo] = useState(1.00);
    const [logofile, setLogofile] = useState('c:/casparcg/_media/anchor.png');
    const [stripColor, setSltripColor] = useState('#ffffff');
    const [fontColor, setFontColor] = useState('#000000');
    const [diskColor, setDiskColor] = useState('#0000ff');


    const setYPosition = async (scene, yPosition) => {
        await sendCommand({ command: `scene "${project}/${scene}" nodes set "RootNode" "Transform.Position.Y" "${yPosition}"` })
    }

    const setXPosition = async (scene, yPosition) => {
        await sendCommand({ command: `scene "${project}/${scene}" nodes set "RootNode" "Transform.Position.X" "${yPosition}"` })
    }

    const setXScale = async (scene, yPosition) => {
        await sendCommand({ command: `scene "${project}/${scene}" nodes set "Group1" "Transform.Scale.X" "${yPosition}"` })
    }

    const setYScale = async (scene, yPosition) => {
        await sendCommand({ command: `scene "${project}/${scene}" nodes set "Group1" "Transform.Scale.Y" "${yPosition}"` })
    }


    const playClock = async () => {
        await playScene({ project, scene: 'vimlesh_clock1', slot: "7", exportValues: {} });
        await setYPosition('vimlesh_clock1', yPositionDate);

    }
    const stopClock = () => {
        stopScene({ project, scene: 'vimlesh_clock1' });
    }

    const playLogo = async () => {
        await playScene({ project, scene: 'Bug', slot: "8", exportValues: { lgBug: `c:/casparcg/_media/${logofile}` } });
        await setXPosition('Bug', xPositionLogo);
        await setYPosition('Bug', yPositionLogo);
        await setXScale('Bug', xScaleLogo);
        await setYScale('Bug', yScaleLogo);
        // sendCommand({ command: `scene "${project}/Bug" EXPORT "lgBug" SetValue "c:/casparcg/_media/${logofile}"` })

    }
    const stopLogo = () => {
        stopScene({ project, scene: 'Bug' });
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
            aa += JSON.stringify({ id: val.id, data1: val.data1, use1: val.use1 }) + '\r\n'
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
    const scrollFileSaveAs2 = () => {
        var aa = ''
        playerList2.forEach(val => {
            aa += JSON.stringify({ id: val.id, data1: val.data1, use1: val.use1 }) + '\r\n'
        });
        const data = new Blob([aa], { type: 'text/plain' });

        const options = {
            fileExtension: '.txt',
            suggestedName: 'BreakingNews_' + generalFileName(),
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

    const handleFileChosen2 = (file) => {
        if (file) {
            fileReader = new FileReader();
            fileReader.onloadend = handleFileRead2;
            fileReader.readAsText(file);
        }
    }
    const handleFileChosenlogo = (file) => {
        setLogofile(file.name)
    }


    const handleFileRead = async () => {
        const content = fileReader.result;
        const aa = content.split('\r\n');
        aa.splice(-1);
        const updatedcanvasList = aa.map(element => {
            const cc = JSON.parse(element);
            return { id: cc.id, data1: cc.data1, use1: cc.use1, };
        });
        setPlayerList1(updatedcanvasList);
    };

    const handleFileRead2 = async () => {
        const content = fileReader.result;
        const aa = content.split('\r\n');
        aa.splice(-1);
        const updatedcanvasList = aa.map(element => {
            const cc = JSON.parse(element);
            return { id: cc.id, data1: cc.data1, use1: cc.use1, };
        });
        setPlayerList2(updatedcanvasList);
    };

    const playticker = async () => {
        const scripts = playerList1.filter(row => row.use1).map(row => row.data1.split("$$$$").map(s => s.replace(/\s+/g, " ").trim()));
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
        sendCommand({ command: `scene "${project}/vimlesh_ticker" resources set "Material1" "Diffuse" ${parseInt(stripColor.replace("#", ""), 16)}` })
        sendCommand({ command: `scene "${project}/vimlesh_ticker" resources set "Material2" "Diffuse" ${parseInt(fontColor.replace("#", ""), 16)}` })
        sendCommand({ command: `scene "${project}/vimlesh_ticker" resources set "Material3" "Diffuse" ${parseInt(diskColor.replace("#", ""), 16)}` })

        await setYPosition('vimlesh_ticker', yPositionscroll);

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

        const exportValues = {
            tTextA: ``,
        }
        const params = [
            { interval_seconds: tmrBraekingNews / 1000 },
            { messages: scripts }
        ]

        await playwithtimer({ project, scene: "BreakingSmall_Ticker", timeline: "In", slot: "5", exportValues, functionName: "play_text_sequence", params })
        sendCommand({ command: `scene "${project}/BreakingSmall_Ticker" nodes action "BreakingText_01" "SetText" "${headingBraekingNews}"` })
        sendCommand({ command: `scene "${project}/BreakingSmall_Ticker" nodes action "BreakingText_02" "SetText" "${headingBraekingNews}"` })
        sendCommand({ command: `scene "${project}/BreakingSmall_Ticker" nodes action "BreakingText_03" "SetText" "${headingBraekingNews}"` })
        sendCommand({ command: `scene "${project}/BreakingSmall_Ticker" nodes action "BreakingText_04" "SetText" "${headingBraekingNews}"` })
        sendCommand({ command: `scene "${project}/BreakingSmall_Ticker" nodes action "BreakingText_05" "SetText" "${headingBraekingNews}"` })

        await setYPosition('BreakingSmall_Ticker', yPositionbreakingNews);

    }


    const playNewsUpdate = async () => {
        const scripts = playerList2.filter(row => row.use1).map(row => row.data1.split("$$$$").map(s => s.replace(/\s+/g, " ").trim()));
        const exportValues = {
            tTextA: ``,
        }
        const params = [
            { interval_seconds: tmrBraekingNews / 1000 },
            { messages: scripts }
        ]
        await playwithtimer({ project, scene: "NewsUpdate", timeline: "In", slot: "5", exportValues, functionName: "play_text_sequence", params })

    }



    const stopplayBreakingSmallTicker = () => {
        fetch("/api/timeline", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ project: 'ddnrcs', scene: 'BreakingSmall_Ticker', timeline: "Out" })
        })
    }

    const stopnewsUpdate = () => {
        fetch("/api/timeline", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ project: 'ddnrcs', scene: 'NewsUpdate', timeline: "Out" })
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

                        Strip Color:   <input
                            type="color"
                            value={stripColor}
                            onChange={(e) => {
                                const hexVal = e.target.value;
                                setSltripColor(e.target.value)
                                const intVal = parseInt(hexVal.replace("#", ""), 16);
                                sendCommand({ command: `scene "${project}/vimlesh_ticker" resources set "Material1" "Diffuse" ${intVal}` })
                            }}
                        />

                        Font Color:   <input
                            type="color"
                            value={fontColor}
                            onChange={(e) => {
                                const hexVal = e.target.value;
                                setFontColor(e.target.value)
                                const intVal = parseInt(hexVal.replace("#", ""), 16);
                                sendCommand({ command: `scene "${project}/vimlesh_ticker" resources set "Material2" "Diffuse" ${intVal}` })
                            }}
                        />
                        Disk Color:   <input
                            type="color"
                            value={diskColor}
                            onChange={(e) => {
                                const hexVal = e.target.value;
                                setDiskColor(e.target.value)
                                const intVal = parseInt(hexVal.replace("#", ""), 16);
                                sendCommand({ command: `scene "${project}/vimlesh_ticker" resources set "Material3" "Diffuse" ${intVal}` })
                            }}
                        />
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
                                    <td>set Y Position <input type="Number" style={{ width: 60 }} step={0.01} value={yPositionscroll} onChange={async (e) => {
                                        setyPositionscroll(e.target.value);
                                        await setYPosition('vimlesh_ticker', e.target.value);
                                    }} /></td>
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
                        <div>
                            <h3>Date and Time</h3>
                            <button onClick={playClock}>Play</button>
                            <button onClick={stopClock}>Stop</button>
                            set Y Position <input type="Number" style={{ width: 60 }} step={0.01} value={yPositionDate} onChange={async (e) => {
                                setYPositionDate(e.target.value);
                                await setYPosition('vimlesh_clock1', e.target.value);
                            }} />
                        </div>

                        <div>
                            <h3>Logo</h3>
                            <span>Open File from c:/casparcg/_media:</span><br />
                            <input
                                type='file'
                                id='file'
                                className='input-file'
                                // accept='.txt'
                                onChange={e => {
                                    handleFileChosenlogo(e.target.files[0]);
                                }}
                            />
                            <br />
                            <button onClick={playLogo}>Play</button>
                            <button onClick={stopLogo}>Stop</button>
                            <br /> set X Position <input type="Number" style={{ width: 60 }} step={0.01} value={xPositionLogo} onChange={async (e) => {
                                setXPositionLogo(e.target.value);
                                await setXPosition('Bug', e.target.value);
                            }} />
                            <br /> set Y Position <input type="Number" style={{ width: 60 }} step={0.01} value={yPositionLogo} onChange={async (e) => {
                                setYPositionLogo(e.target.value);
                                await setYPosition('Bug', e.target.value);
                            }} />
                            <br /> set X Scale <input type="Number" style={{ width: 60 }} step={0.01} value={xScaleLogo} onChange={async (e) => {
                                setXScaleLogo(e.target.value);
                                await setXScale('Bug', e.target.value);
                            }} />

                            <br /> set Y Scale <input type="Number" style={{ width: 60 }} step={0.01} value={yScaleLogo} onChange={async (e) => {
                                setYScaleLogo(e.target.value);
                                await setYScale('Bug', e.target.value);
                            }} />

                        </div>

                    </div>

                </div>
            </div>


            <div style={{ border: '3px solid blue' }}>
                <div>
                    <button onClick={playBreakingSmallTicker}> Play Breaking News</button>
                    <button onClick={stopplayBreakingSmallTicker}> Stop Breaking News</button>
                    <label htmlFor="">Timer milli second</label> <input style={{ width: 40 }} type='text' value={tmrBraekingNews} onChange={e => setTmrBraekingNews(e.target.value)}></input>
                    <label htmlFor="">Heading</label> <input style={{ width: 100 }} type='text' value={headingBraekingNews} onChange={e => setHeadingBreakingNews(e.target.value)}></input>
                    <button onClick={playNewsUpdate}> Play News Update</button>
                    <button onClick={stopnewsUpdate}> Stop News Update</button>
                </div>
                <div style={{ minwidth: 1900, margin: 20 }}>
                    <div style={{ border: '1px solid red' }}>
                        <table border='1px solid red'>
                            <tbody >
                                <tr>
                                    <td><button onClick={scrollFileSaveAs2}>Save</button></td>
                                    <td><span>Open File:</span><input
                                        type='file'
                                        id='file'
                                        className='input-file'
                                        accept='.txt'
                                        onChange={e => {
                                            handleFileChosen2(e.target.files[0]);
                                        }}
                                    /></td>
                                    <td>set Y Position <input type="Number" style={{ width: 60 }} step={0.01} value={yPositionbreakingNews} onChange={async (e) => {
                                        setyPositionbreakingNews(e.target.value);
                                        await setYPosition('BreakingSmall_Ticker', e.target.value);
                                    }} /></td>

                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style={{ backgroundColor: 'grey', height: 300, width: 1850, overflow: 'auto' }}>
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