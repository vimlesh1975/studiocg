
'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Timer from './Timer';
import { addressmysql } from "../lib/common";
import Script from "../Script";
import { stopScene, sendCommand, playwithtimer, playScene } from '../lib/common';

const project = "ddnrcs";
// const project = "25IN_ChannelPackaging_351.450";

const vTrailingSpace = 0.1;

const NrcsScroll = () => {
    const [yPositionscroll, setyPositionscroll] = useState(0.00);
    const [yPositiondate, setyPositiondate] = useState(0.00);
    const [yPositionnewsupdate, setyPositionnewsupdate] = useState(0.00);
    const [yPositionbreakingNews, setyPositionbreakingNews] = useState(0.00);
    const [yPositionTwoliner, setyPositionTwoliner] = useState(0.00);

    const [slugs, setSlugs] = useState([]);
    const [currentSlug, setCurrentSlug] = useState(-1);
    const [ScriptID, setScriptID] = useState("");
    const [currentSlugSlugName, setCurrentSlugSlugName] = useState("");

    const [tickerRunning, setTickerRunning] = useState(false);

    const [runOrderTitles, setRunOrderTitles] = useState([]);
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    });
    const [selectedRunOrderTitle, setSelectedRunOrderTitle] = useState("Breaking News");
    const [horizontalSpeed, setHorizontalSpeed] = useState(0.01);
    const [scrollData, setScrollData] = useState([]);

    const [NrcsBreakingText, setNrcsBreakingText] = useState(true)
    const indexRefTicker = useRef(1);

    const setYPosition = async (scene, yPosition) => {
        await sendCommand({ command: `scene "${project}/${scene}" nodes set "RootNode" "Transform.Position.Y" "${yPosition}"` })
    }

    const playFullPageBreakingNewswithinput = async () => {
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
            if (scripts != []) {
                const exportValues = {
                    text1: ``,
                }
                const params = [
                    { interval_seconds: "2" },
                    { messages: scripts }
                ]
                await playwithtimer({ project, scene: "vimlesh_bn1", timeline: "In", slot: "10", exportValues, functionName: "play_text_sequence", params })
            }
        } catch (error) {
        }
    }
    const stopFullPageBreakingNewswithinput = () => {
        stopScene({ project, scene: 'vimlesh_bn1' });
        setfullpagebreakingnewsrunningwithinput(false);
    }

    const playFullPageBreakingNews = async () => {
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
            if (scripts != []) {
                const exportValues = {
                    text2: ``,
                }
                const params = [
                    { interval_seconds: "2" },
                    { messages: scripts }
                ]
                await playwithtimer({ project, scene: "vimlesh_fullpage_breaking_news1", timeline: "In", slot: "9", exportValues, functionName: "play_text_sequence", params })
            }

        } catch (error) {
        }
    }
    const stopFullPageBreakingNews = () => {
        stopScene({ project, scene: 'vimlesh_fullpage_breaking_news1' });
        setfullpagebreakingnewsrunning(false);
    }

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
            if (scripts != []) {
                const exportValues = {
                    tTextA: ``,
                }
                await playScene({ project, scene: 'NewsUpdate', slot: "6", exportValues });
                const params = [
                    { interval_seconds: "2" },
                    { messages: scripts }
                ]
                await playwithtimer({ project, scene: "NewsUpdate", timeline: "In", slot: "6", exportValues, functionName: "play_text_sequence", params })
                await setYPosition('NewsUpdate', yPositionnewsupdate);
            }

        } catch (error) {
        }

    }
    const stopNewsUpdate = () => {
        stopScene({ project, scene: 'NewsUpdate' });

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
                const exportValues = {
                    url1: `${NrcsBreakingText ? new URL("/yellow_breaking_news.gif", window.location.origin).toString() : new URL("/yellow_news_update.gif", window.location.origin).toString()}`,
                    text2: ``,
                }
                const params = [
                    { interval_seconds: "2" },
                    { messages: scripts }
                ]
                await playwithtimer({ project, scene: "vimlesh_twoliner2", timeline: "In", slot: "8", exportValues, functionName: "play_text_sequence", params })
                await setYPosition('vimlesh_twoliner2', yPositionTwoliner);
            }
        } catch (error) {
        }
    }
    const stopTwoliner = () => {
        stopScene({ project, scene: 'vimlesh_twoliner2' });
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
            if (scripts != []) {
                setBreakingdata(scripts);
                await setYPosition('BreakingSmall_Ticker', yPositionbreakingNews);
                const exportValues = { tTextA: `` }
                const params = [
                    { interval_seconds: "2" },
                    { messages: scripts }
                ]
                await playwithtimer({ project, scene: "BreakingSmall_Ticker", timeline: "In", slot: "5", exportValues, functionName: "play_text_sequence", params })
            }
        } catch (error) {
        }
    }
    const stopplayBreakingSmallTicker = () => {
        stopScene({ project, scene: 'BreakingSmall_Ticker' });

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
        }
    }, [selectedRunOrderTitle, selectedDate]);

    useEffect(() => {
        fetchRO();
    }, [selectedRunOrderTitle, fetchRO]);

    const handleChange = (event) => {
        const value = event.target.value === 'true';  // Convert string to boolean
        setNrcsBreakingText(value)
    };

    const playClock = async () => {
        await playScene({ project, scene: 'vimlesh_clock1', slot: "7", exportValues: {} });

        await setYPosition('vimlesh_clock1', yPositiondate);
    }
    const stopClock = () => {
        stopScene({ project, scene: 'vimlesh_clock1' });
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
                await playScene({ project, scene: 'vimlesh_ticker', slot: "1", exportValues });
                await setYPosition('vimlesh_ticker', yPositionscroll);
            }
        } catch (error) {
        }
    }
    const onhorizontalSpeedChange = async (e) => {
        setHorizontalSpeed(e.target.value);
        await sendCommand({ command: `SCENE "ddnrcs/vimlesh_ticker" Export "vSpeed" SetValue "${e.target.value}"` })
    }

    const onStopTicker = async () => {
        stopScene({ project, scene: 'vimlesh_ticker' });
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
            <button style={{ backgroundColor: 'darkred', color: 'white' }} onClick={() => {
                fetch("/api/unloadAllScenes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });
                // setbreakingsmalltickerRunning(false);
                // setfullpagebreakingnewsrunning(false);
                // setfullpagebreakingnewsrunningwithinput(false);
                // setnewsupdateRunning(false);
                // setTwolinerRunning(false);
                setTickerRunning(false);
            }}
            >
                🧹 Unload All Scenes</button>
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
                <table style={{ borderCollapse: 'collapse', width: 500 }}>
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
                                <br /> set Y Position <input type="Number" style={{ width: 60 }} step={0.01} value={yPositiondate} onChange={async (e) => {
                                    setyPositiondate(e.target.value);
                                    await setYPosition('vimlesh_clock1', e.target.value);
                                }} />
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
                                    step="0.001"
                                    value={horizontalSpeed}
                                />
                            </td>
                            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>

                                <button onClick={() => {
                                    playticker();

                                }}>Play</button>
                                {tickerRunning && (
                                    <Timer
                                        interval={2000}
                                        callback={async () => {
                                            const currentItem = scrollData[indexRefTicker.current];

                                            if (currentItem) {
                                                await sendCommand({ command: `SCENE "ddnrcs/vimlesh_ticker" Export "tScroll" SetValue "{'Group1':[{'vLeadingSpace':'0','vTrailingSpace':'${vTrailingSpace}','tText':'${currentItem}'}]}"` })
                                            }
                                            indexRefTicker.current = (indexRefTicker.current + 1) % scrollData.length;
                                        }}
                                    />
                                )}
                                <button onClick={onStopTicker}>Stop</button>
                                <br />
                                set Y Position <input style={{ width: 40 }} type="Number" step={0.01} value={yPositionscroll} onChange={async (e) => {
                                    setyPositionscroll(e.target.value);
                                    await setYPosition('vimlesh_ticker', e.target.value);
                                }} />
                            </td>
                        </tr>

                        <tr>
                            <td style={{ border: '1px solid black', padding: '8px', fontWeight: 'bolder' }}>Lower Third
                                Breaking News</td>
                            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>

                                <button onClick={playBreakingSmallTicker}>Play</button>
                                <button onClick={stopplayBreakingSmallTicker}> Stop</button>
                                <br /> set Y Position <input type="Number" style={{ width: 60 }} step={0.01} value={yPositionbreakingNews} onChange={async (e) => {
                                    setyPositionbreakingNews(e.target.value);
                                    await setYPosition('BreakingSmall_Ticker', e.target.value);
                                }} />
                            </td>
                        </tr>

                        <tr>
                            <td style={{ border: '1px solid black', padding: '8px', fontWeight: 'bolder' }}>  Full Page
                                Breaking News</td>
                            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                                <button onClick={playFullPageBreakingNews}>Play</button>
                                <button onClick={stopFullPageBreakingNews}>Stop</button>

                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '8px', fontWeight: 'bolder' }}>  Full Pag
                                Breaking News with input</td>
                            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                                <button onClick={playFullPageBreakingNewswithinput}>Play</button>
                                <button onClick={stopFullPageBreakingNewswithinput}>Stop</button>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '8px', fontWeight: 'bolder' }}>News Update</td>
                            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                                <button onClick={playNewsUpdate}>Play</button>
                                <button onClick={stopNewsUpdate}>Stop</button>

                                <br /> set Y Position <input type="Number" style={{ width: 60 }} step={0.01} value={yPositionnewsupdate} onChange={async (e) => {
                                    setyPositionnewsupdate(e.target.value);
                                    await setYPosition('NewsUpdate', e.target.value);
                                }} />
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
                                <button onClick={playTwoliner}>Play</button>
                                <button onClick={stopTwoliner}>Stop</button>
                                <br /> set Y Position <input type="Number" style={{ width: 60 }} step={0.01} value={yPositionTwoliner} onChange={async (e) => {
                                    setyPositionTwoliner(e.target.value);
                                    await setYPosition('vimlesh_twoliner2', e.target.value);

                                }} />
                            </td>
                        </tr>
                    </tbody>
                </table >
            </div >
        </div>




    </>)
}

export default NrcsScroll
