import React, { useState } from 'react'
import { iniBreakingNews } from './hockeyData'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { VscMove } from "react-icons/vsc";
import { v4 as uuidv4 } from 'uuid';
// import { isEqual } from "lodash";
import { generateUniqueId, createRect, shadowOptions, options, generalFileName, saveFile } from './common'

// const aa = 'It seems as if the boat is in the air the water is so clean and transparent. All three Pahalgam attack terrorists killed in Operation Mahadev Amit Shah tells Parliament. Umngot to Chambal Indias 5 cleanest rivers and where they are located. Home Minister Amit Shah on Tuesday, July 29 confirmed that. Mahadev on July 28 were Pahalgam terrorist attack';

const Scroll = () => {
    const [ltr, setLtr] = useState(false);

    const [playerList1, setPlayerList1] = useState(iniBreakingNews);
    const [delemeter, setDelemeter] = useState('⏺️')

    const bb = playerList1.map((val) => val.data1)
    const aa = bb.join(" ")
    const command = `SCENE "25IN_ChannelPackaging_351.450/vimlesh_ticker" Export "tScroll" SetValue "{'Group1':[{'vLeadingSpace':'0','vTrailingSpace':'0','tText':'${aa}'}]}"`


    const onDragEnd1 = (result) => {
        const aa = [...playerList1]
        if (result.destination != null) {
            aa.splice(result.destination?.index, 0, aa.splice(result.source?.index, 1)[0])
            setPlayerList1(aa);
            // setNewplayerList1(aa)
        }
    }

    const deletePage = e => {
        if (playerList1.length === 1) {
            return
        }
        const aa = [...playerList1]
        aa.splice(parseInt(e.target.getAttribute('key1')), 1);
        setPlayerList1(aa);
        // setNewplayerList1(aa)
    }
    const addPage = e => {
        const aa = [...playerList1]
        aa.splice(parseInt(e.target.getAttribute('key1')) + 1, 0, { id: uuidv4(), data1: '', use1: false });
        setPlayerList1(aa);
        // setNewplayerList1(aa)

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
        // setNewplayerList1(updatedcanvasList);
    };

    const setAsScrollText = () => {

        var aa = '';
        var left1 = 0;
        var arr;
        if (ltr) {
            arr = [...playerList1].slice().reverse();
        }
        else {
            arr = [...playerList1]
        }

        arr.forEach(element => {
            const id = generateUniqueId({ type: "id" });
            if (element.use1 === true) {
                aa = ` ${delemeter} ` + element.data1;
                const text = new fabric.IText(aa, {
                    id: id,
                    class: id,
                    left: left1,
                    ...scrollTextProperties, shadow: { ...shadowOptions, blur: 0 },
                });
                canvas.add(text);
                canvas.setActiveObject(text);
                canvas.renderAll();
                left1 += canvas.getActiveObjects()[0].width;
            };

        });

        canvas.requestRenderAll();
    }

    const setAsScrollText2 = () => {
        var left1 = 0;

        var arr;
        if (ltr) {
            arr = [...playerList1].slice().reverse();
        }
        else {
            arr = [...playerList1]
        }

        arr.forEach((element, i) => {
            if (element.use1 === true) {
                fabric.FabricImage.fromURL(element.delemeterLogo).then(myImg => {
                    if (myImg == null) {
                        alert("Error!");
                    } else {
                        myImg.scaleToHeight(45);
                        canvas.add(myImg);
                        canvas.setActiveObject(myImg);
                        const id = generateUniqueId({ type: "id" });

                        myImg.set({
                            id: id,
                            class: id,
                            left: left1,
                            top: scrollTextProperties.top,
                            crossOrigin: 'anonymous'
                        })
                        canvas.renderAll();
                        left1 += 25 + canvas.getActiveObjects()[0].width * canvas.getActiveObjects()[0].scaleX;
                        const id2 = generateUniqueId({ type: "id" });

                        const text = new fabric.IText(element.data1, {
                            id: id2,
                            class: id2,
                            left: left1,
                            ...scrollTextProperties, shadow: { ...shadowOptions, blur: 0 },
                        });
                        canvas.add(text);
                        canvas.setActiveObject(text);
                        canvas.renderAll();
                        left1 += 25 + canvas.getActiveObjects()[0].width;
                    }
                });
            };
        });
        canvas.requestRenderAll();
    }

    const addStrip = () => {
        createRect(canvas)
        canvas.getActiveObjects()[0].set({ id: 'scroll1_strip' })
    }
    const addStrip2 = () => {
        createRect(canvas)
        canvas.getActiveObjects()[0].set({ id: 'scroll2_strip' })
    }
    const deleteScroll = () => {
        const aa = canvas.getObjects();
        aa.forEach((element) => {
            if ((element.type === 'image') || (element.type === 'i-text')) {
                canvas.remove(element);
            }
        });
        canvas.discardActiveObject();
        canvas.requestRenderAll();
    }

    const playticker = () => {

        const exportValues = {
            vSpeed: 10.01,
            vStart: true,
            vStackCount: 1,
            // vStackSize: 1,
            vReset: true,
            tText: '',
            tScroll: `{ 'Group1': [{ 'vLeadingSpace':'0', 'vTrailingSpace':'0', 'tText': '${aa}'}]}`
        }
        fetch("/api/playwithexportedvalues", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                project: '25IN_ChannelPackaging_351.450',
                scene: 'vimlesh_ticker',
                timeline: 'In',
                exportedvalues: Object.entries(exportValues).map(([name, value]) => ({ name, value }))
            })
        })
    }
    return (
        <div>
            <div style={{ display: 'flex1' }}>
                <div>
                    <button onClick={playticker}>Play</button>
                    <button
                        onClick={async () => {
                            for (let i = 0; i < 5; i++) {
                                const res = await fetch("/api/sendCommand", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ command })
                                })

                            }

                        }}
                    >
                        Send Command
                    </button>
                </div>
                <table border='0'>
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
                        </tr>
                    </tbody>
                </table>
                <div style={{ border: '1px solid red' }}>

                    <table border='0'>
                        <tbody >
                            <tr>
                                <td><button onClick={() => {
                                    const selectedObject = canvas.getActiveObjects()[0];
                                    if (selectedObject) {
                                        setScrollTextProperties({
                                            shadow: selectedObject.shadow,
                                            top: selectedObject.top,
                                            fill: selectedObject.fill,
                                            fontFamily: selectedObject.fontFamily,
                                            fontWeight: selectedObject.fontWeight,
                                            fontSize: selectedObject.fontSize,
                                            editable: true,
                                            objectCaching: false,
                                            textAlign: 'left',
                                            stroke: selectedObject.stroke,
                                            strokeWidth: selectedObject.strokeWidth,
                                        })
                                    }
                                }}>Set text Properties as selected object</button></td>
                                <td></td>
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
                            </tr>
                        </tbody>
                    </table>
                    <table border='0'>
                        <tbody >
                            <tr>
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
                                    // setNewplayerList1(updateddelemeterlogo)


                                }}>Set all logo as first logo</button>
                                    <button onClick={addStrip}>Add Strip with id scroll1_strip</button>
                                    <button onClick={addStrip2}>Add Strip with id scroll2_strip</button>
                                    <button onClick={deleteScroll}>Delete Scroll</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            {/* <button style={{ display: (isEqual(newplayerList1, playerList1)) ? 'none' : 'inline', backgroundColor: 'red' }} onClick={updateplayerList1}>Update Data</button> */}
            <div style={{ display: 'flex', minwidth: 650, margin: 20 }}>
                <div style={{ backgroundColor: 'grey', height: 700, width: 800, overflow: 'auto' }}>
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
                                                                        // setNewplayerList1(updatednewplayerList1)
                                                                        setPlayerList1(updatednewplayerList1)
                                                                        // newplayerList1[i] = { ...newplayerList1[i], data1: e.target.value };
                                                                        // setNewplayerList1([...newplayerList1])
                                                                    }}
                                                                />
                                                                </td>
                                                                <td><input checked={val.use1} type='checkbox' onChange={(e) => {
                                                                    // newplayerList1[i] = { ...newplayerList1[i], use1: e.target.checked };
                                                                    // setNewplayerList1([...newplayerList1]);
                                                                    // setPlayerList1([...newplayerList1]);

                                                                    const updatednewplayerList1 = [...playerList1]
                                                                    updatednewplayerList1[i] = { ...updatednewplayerList1[i], use1: e.target.checked };
                                                                    // setNewplayerList1(updatednewplayerList1)
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

export default Scroll