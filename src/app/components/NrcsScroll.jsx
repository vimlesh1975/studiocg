
'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Timer from './Timer';
import { addressmysql } from "../lib/common";
import Script from "../Script";


const vTrailingSpace = 0.1;

const NrcsScroll = () => {
    const [slugs, setSlugs] = useState([]);
    const [currentSlug, setCurrentSlug] = useState(-1);
    const [ScriptID, setScriptID] = useState("");
    const [currentSlugSlugName, setCurrentSlugSlugName] = useState("");

    const [breakingsmalltickerRunning, setbreakingsmalltickerRunning] = useState(false);
    const [newsupdateRunning, setnewsupdateRunning] = useState(false);
    const [twolinerRunning, setTwolinerRunning] = useState(false);



    const [runOrderTitles, setRunOrderTitles] = useState([]);
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    });
    const [selectedRunOrderTitle, setSelectedRunOrderTitle] = useState("0600 Hrs");
    const [horizontalSpeed, setHorizontalSpeed] = useState(0.01);
    const [tickerRunning, setTickerRunning] = useState(false);
    const [scrollData, setScrollData] = useState([]);
    const [breakingdata, setBreakingdata] = useState([]);
    const [newsUpdataeData, setnewsUpdataeData] = useState([]);
    const [twolinerData, setTwolinerData] = useState([]);

    const [NrcsBreakingText, setNrcsBreakingText] = useState(true)
    const indexRefTicker = useRef(1);
    const indexRefbreakingsmallticker = useRef(0);
    const indexRefnewsupdate = useRef(0);
    const indextwoliner = useRef(0);



    const playNewsUpdate = async () => {

        let scripts = [];

        try {
            const res = await fetch(addressmysql() + "/getScrollData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bulletinname: "News Update", bulletindate: selectedDate
                }),
            });
            const result = await res.json()
            scripts = result.data.map(row => row.Script);
            console.log(scripts)
            if (scripts != []) {
                setnewsupdateRunning(true);
                setnewsUpdataeData(scripts);
                indexRefnewsupdate.current = 1;
                const exportValues = {
                    tTextA: `${scripts[0]}`,
                    tTextB: `${scripts[1]}`,
                }
                fetch("/api/playwithexportedvalues", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        project: '25IN_ChannelPackaging_351.450',
                        scene: 'NewsUpdate',
                        timeline: 'In',
                        slot: "6",
                        exportedvalues: Object.entries(exportValues).map(([name, value]) => ({ name, value }))
                    })
                })


            }

        } catch (error) {
            // console.error('Error saving content:', error);
        }

        // indexRefnewsupdate.current = 0;
        // const exportValues = {
        //     tTextA: `${playerList1[0].data1}`,
        //     tTextB: `${playerList1[1].data1}`,
        // }
        // fetch("/api/playwithexportedvalues", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({
        //         project: '25IN_ChannelPackaging_351.450',
        //         scene: 'NewsUpdate',
        //         timeline: 'In',
        //         slot: "6",
        //         exportedvalues: Object.entries(exportValues).map(([name, value]) => ({ name, value }))
        //     })
        // })
        // setnewsupdateRunning(true);
    }
    const stopNewsUpdate = () => {
        fetch("/api/timeline", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ project: '25IN_ChannelPackaging_351.450', scene: 'NewsUpdate', timeline: "Out" })
        })
        setnewsupdateRunning(false);

    }

    const playTwoliner = async () => {

        let scripts = [];

        try {
            const res = await fetch(addressmysql() + "/getScrollData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bulletinname: "Two Liner", bulletindate: selectedDate
                }),
            });
            const result = await res.json()
            scripts = result.data.map(row => row.Script);
            if (scripts != []) {
                setTwolinerRunning(true);
                setTwolinerData(scripts);
                indextwoliner.current = 1;
                const exportValues = {
                    text1: `${NrcsBreakingText ? "Breaking News" : "News Update"}`,
                    text2: `${scripts[0]}`,
                }
                fetch("/api/playwithexportedvalues", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        project: '25IN_ChannelPackaging_351.450',
                        scene: 'vimlesh_twoliner1',
                        timeline: 'In',
                        slot: "8",
                        exportedvalues: Object.entries(exportValues).map(([name, value]) => ({ name, value }))
                    })
                })


            }

        } catch (error) {
            // console.error('Error saving content:', error);
        }


    }
    const stopTwoliner = () => {
        fetch("/api/timeline", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ project: '25IN_ChannelPackaging_351.450', scene: 'vimlesh_twoliner1', timeline: "Out" })
        })
        setTwolinerRunning(false);

    }

    const playBreakingSmallTicker = async () => {

        let scripts = [];

        try {
            const res = await fetch(addressmysql() + "/getScrollData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bulletinname: "Breaking News", bulletindate: selectedDate
                }),
            });
            const result = await res.json()
            scripts = result.data.map(row => row.Script);
            console.log(scripts)
            if (scripts != []) {
                setbreakingsmalltickerRunning(true);
                setBreakingdata(scripts);
                indexRefbreakingsmallticker.current = 1;
                const exportValues = {
                    tTextA: `${scripts[0].data1}`,
                    tTextB: `${scripts[1].data1}`,
                }
                fetch("/api/playwithexportedvalues", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        project: '25IN_ChannelPackaging_351.450',
                        scene: 'BreakingSmall_Ticker',
                        timeline: 'In',
                        slot: "5",
                        exportedvalues: Object.entries(exportValues).map(([name, value]) => ({ name, value }))
                    })
                })


            }

        } catch (error) {
            // console.error('Error saving content:', error);
        }

    }
    const stopplayBreakingSmallTicker = () => {
        fetch("/api/timeline", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ project: '25IN_ChannelPackaging_351.450', scene: 'BreakingSmall_Ticker', timeline: "Out" })
        })
        setbreakingsmalltickerRunning(false);

    }


    const handleSelectionChange = (e) => {
        setSelectedRunOrderTitle(e.target.value);

    };

    const handleDateChange = (event) => {
        const date = event.target.value;
        setSelectedDate(date)
    };

    async function fetchNewsID() {
        try {
            const res = await fetch(addressmysql() + "/getNewsIDforCG");
            const data = await res.json();
            setRunOrderTitles(data.data);
        } catch (error) {
            // console.error('Error fetching RunOrderTitles:', error);
        }
    }

    useEffect(() => {
        fetchNewsID();
    }, []);

    const fetchRO = useCallback(async () => {
        if (selectedRunOrderTitle === "") {
            return;
        }
        try {
            const res = await fetch(
                addressmysql() + `/ShowRunOrder?NewsId=${selectedRunOrderTitle}&date=${selectedDate}`
            );
            const data = await res.json();
            setSlugs(data.data);
        } catch (error) {
            // console.error('Error fetching data:', error);
        }
    }, [selectedRunOrderTitle, selectedDate]);




    useEffect(() => {
        fetchRO();
    }, [selectedRunOrderTitle, fetchRO]);

    const handleChange = (event) => {
        const value = event.target.value === 'true';  // Convert string to boolean
        setNrcsBreakingText(value)
    };

    const playClock = () => {
        fetch("/api/timeline", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                project: '25IN_ChannelPackaging_351.450',
                scene: 'vimlesh_clock1',
                timeline: 'In',
                slot: "7",
            })
        })
    }
    const stopClock = () => {
        fetch("/api/timeline", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ project: '25IN_ChannelPackaging_351.450', scene: 'vimlesh_clock1', timeline: "Out" })
        })
    }
    const playticker = async () => {
        let scripts = [];

        try {
            const res = await fetch(addressmysql() + "/getScrollData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bulletinname: "Scroll", bulletindate: selectedDate
                }),
            });
            const result = await res.json()
            scripts = result.data.map(row => row.Script);
            console.log(scripts)
            if (scripts != []) {
                setTickerRunning(true);
                setScrollData(scripts);
                indexRefTicker.current = 1;
                const exportValues = {
                    vSpeed: `${horizontalSpeed}`,
                    vStart: true,
                    vStackCount: "1",
                    // vStackSize: 1,
                    vReset: true,
                    tText: '',
                    tScroll: `{ 'Group1': [{ 'vLeadingSpace':'0', 'vTrailingSpace':'${vTrailingSpace}', 'tText': '${scripts[0]}' }] }`,
                }
                fetch("/api/playwithexportedvalues", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        project: '25IN_ChannelPackaging_351.450',
                        scene: 'vimlesh_ticker',
                        timeline: 'In',
                        slot: "1",
                        exportedvalues: Object.entries(exportValues).map(([name, value]) => ({ name, value }))
                    })
                })


            }

        } catch (error) {
            // console.error('Error saving content:', error);
        }



    }
    const onhorizontalSpeedChange = async (e) => {
        setHorizontalSpeed(e.target.value);
        const res = await fetch("/api/sendCommand", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ command: `SCENE "25IN_ChannelPackaging_351.450/vimlesh_ticker" Export "vSpeed" SetValue "${e.target.value}"` })
        })
    }

    const onStopTicker = async () => {
        fetch("/api/timeline", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ project: '25IN_ChannelPackaging_351.450', scene: 'vimlesh_ticker', timeline: "Out" })
        })
        setTickerRunning(false);

    }
    useEffect(() => {
        fetchRO();
    }, [selectedRunOrderTitle, fetchRO]);

    return (<>
        <div>
            <h1>
                Nrcs Scroll
            </h1>
        </div>


        <div>
            <label htmlFor="date-selector">Select a date: </label>
            <input
                id="date-selector"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
            />

        </div>
        <div>
            Run Orders:
            <select
                value={selectedRunOrderTitle}
                onChange={handleSelectionChange}
            >
                <option value="" disabled>
                    Select a Run Order
                </option>
                {runOrderTitles &&
                    runOrderTitles?.map((runOrderTitle, i) => (
                        <option key={i} value={runOrderTitle.title}>
                            {runOrderTitle.title}
                        </option>
                    ))}
            </select>
            {slugs?.length} slugs
        </div>


        <div style={{ display: 'flex' }}>
            <div style={{ height: 450, width: 400, overflow: "auto", border: '1px solid red' }}>
                {slugs &&
                    slugs?.map((val, i) => (<div
                        title={val.ScriptID}
                        onClick={() => {
                            setScriptID(val.ScriptID);
                            setCurrentSlug(i);
                            setCurrentSlugSlugName(val.SlugName);
                        }}
                        key={i} style={{
                            display: 'flex', color: currentSlug === i ? "white" : "black",
                            backgroundColor: currentSlug === i ? "green" : "#E7DBD8",
                            margin: 10,
                        }}>
                        <div
                            style={{
                                minWidth: 320,
                                maxWidth: 320,
                            }}
                        >
                            {i + 1}{" "}
                            <label style={{ cursor: "pointer" }}>{val.SlugName}</label>{" "}
                        </div>
                        <div>{val.MediaInsert}</div>
                    </div>
                    ))}
            </div>
            <div style={{ height: 350, }}>
                <Script
                    ScriptID={ScriptID}
                    title={selectedRunOrderTitle}
                    currentSlugSlugName={currentSlugSlugName}
                />
            </div>
            <div style={{ height: 450, }}>
                <table style={{ borderCollapse: 'collapse', width: 400 }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Feature</th>
                            <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '8px', fontWeight: 'bolder' }}>Date and Time</td>
                            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                                <button onClick={playClock}>Play</button>
                                <button onClick={stopClock}>Stop</button>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '8px', fontWeight: 'bolder' }}>Scroll
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
                            </td>
                            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>

                                <button onClick={() => {
                                    playticker();

                                }}>Play</button>
                                {tickerRunning && (
                                    <Timer
                                        interval={3000}
                                        callback={async () => {
                                            // console.log(indexRefTicker.current)
                                            const currentItem = scrollData[indexRefTicker.current];

                                            if (currentItem) {
                                                const aa = `SCENE "25IN_ChannelPackaging_351.450/vimlesh_ticker" Export "tScroll" SetValue "{'Group1':[{'vLeadingSpace':'0','vTrailingSpace':'${vTrailingSpace}','tText':'${currentItem}'}]}"`;

                                                await fetch("/api/sendCommand", {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ command: aa }),
                                                });
                                            }

                                            // update index safely
                                            indexRefTicker.current = (indexRefTicker.current + 1) % scrollData.length;

                                        }}
                                    />
                                )}
                                <button onClick={onStopTicker}>Stop</button>
                            </td>
                        </tr>

                        <tr>
                            <td style={{ border: '1px solid black', padding: '8px', fontWeight: 'bolder' }}>Lower Third
                                Breaking News</td>
                            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                                {
                                    breakingsmalltickerRunning && (
                                        <Timer
                                            interval={3000}
                                            callback={async () => {

                                                await fetch("/api/timeline", {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ project: "25IN_ChannelPackaging_351.450", scene: "BreakingSmall_Ticker", timeline: "Text01_In", slot: "5" })
                                                })

                                                const currentItem = breakingdata[indexRefbreakingsmallticker.current];
                                                const exportValues = {
                                                    tTextA: `${currentItem}`,
                                                }
                                                const updates = Object.entries(exportValues).map(([name, value]) => ({ name, value }))
                                                await fetch("/api/setExports", {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ project: "25IN_ChannelPackaging_351.450", scene: "BreakingSmall_Ticker", updates })
                                                })

                                                indexRefbreakingsmallticker.current = (indexRefbreakingsmallticker.current + 1) % breakingdata.length;

                                            }}
                                        />
                                    )
                                }
                                <button onClick={playBreakingSmallTicker}>Play</button>
                                <button onClick={stopplayBreakingSmallTicker}> Stop</button>
                            </td>
                        </tr>

                        {/* <tr>
                            <td style={{ border: '1px solid black', padding: '8px', fontWeight: 'bolder' }}>  Full Pag
                                Breaking News</td>
                            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>

                                <button>Play</button>
                                <button>Stop</button>
                            </td>
                        </tr> */}
                        <tr>
                            <td style={{ border: '1px solid black', padding: '8px', fontWeight: 'bolder' }}>News Update</td>
                            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>

                                {
                                    newsupdateRunning && (
                                        <Timer
                                            interval={3000}
                                            callback={async () => {

                                                await fetch("/api/timeline", {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ project: "25IN_ChannelPackaging_351.450", scene: "NewsUpdate", timeline: "Text01_In", slot: "6" })
                                                })

                                                const currentItem = newsUpdataeData[indexRefnewsupdate.current];
                                                const exportValues = {
                                                    tTextA: `${currentItem}`,
                                                }
                                                const updates = Object.entries(exportValues).map(([name, value]) => ({ name, value }))
                                                await fetch("/api/setExports", {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ project: "25IN_ChannelPackaging_351.450", scene: "NewsUpdate", updates })
                                                })

                                                indexRefnewsupdate.current = (indexRefnewsupdate.current + 1) % newsUpdataeData.length;

                                            }}
                                        />
                                    )
                                }

                                <button onClick={playNewsUpdate}>Play</button>
                                <button onClick={stopNewsUpdate}>Stop</button>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '8px', fontWeight: 'bolder' }}> Two Liner
                                Header:
                                <br />
                                Header: <br />
                                <label>

                                    <input
                                        type="radio"
                                        value={true}
                                        checked={NrcsBreakingText === true}
                                        onChange={handleChange}
                                    />
                                    Breaking News
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value={false}
                                        checked={NrcsBreakingText === false}
                                        onChange={handleChange}
                                    />
                                    News Update
                                </label></td>
                            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>

                                {
                                    twolinerRunning && (
                                        <Timer
                                            interval={3000}
                                            callback={async () => {

                                                await fetch("/api/timeline", {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ project: "25IN_ChannelPackaging_351.450", scene: "vimlesh_twoliner1", timeline: "Text01_In", slot: "6" })
                                                })

                                                const currentItem = twolinerData[indextwoliner.current];
                                                const exportValues = {
                                                    text1: `${NrcsBreakingText ? "Breaking News" : "News Update"}`,
                                                    text2: `${currentItem}`,
                                                }
                                                const updates = Object.entries(exportValues).map(([name, value]) => ({ name, value }))
                                                await fetch("/api/setExports", {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ project: "25IN_ChannelPackaging_351.450", scene: "vimlesh_twoliner1", updates })
                                                })

                                                indextwoliner.current = (indextwoliner.current + 1) % twolinerData.length;

                                            }}
                                        />
                                    )
                                }

                                <button onClick={playTwoliner}>Play</button>
                                <button onClick={stopTwoliner}>Stop</button>
                            </td>
                        </tr>

                    </tbody>
                </table >
            </div >
        </div>




    </>)
}

export default NrcsScroll
