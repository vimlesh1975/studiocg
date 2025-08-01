import { useEffect, useState, useCallback } from "react";
import {
    getFormattedDatetimeNumber,
    addressmysql,
    LoadingModal

} from "./lib/common";
import Script from "./Script";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { VscTrash, VscMove } from "react-icons/vsc";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Oneliner from "./Oneliner";
// import DataUpdater from "./DataUpdater";

import debounce from "lodash.debounce";
import Timer from "./Timer";

import Spinner from "./spinner/Spinner";
import FlashMessage from "./FlashMessage";


const Nrcs2 = () => {
    const [allDocs, setAllDocs] = useState([])
    const [pageName, setPageName] = useState("new Graphics");
    const [runOrderTitles, setRunOrderTitles] = useState([]);
    const [selectedRunOrderTitle, setSelectedRunOrderTitle] = useState("0600 Hrs");
    const [selectedRunOrderTitle2, setSelectedRunOrderTitle2] = useState("0700 Hrs");
    const [slugs, setSlugs] = useState([]);
    const [slugs2, setSlugs2] = useState([]);
    const [ScriptID, setScriptID] = useState("");
    const [ScriptID2, setScriptID2] = useState("");
    const [currentSlug, setCurrentSlug] = useState(-1);
    const [currentSlug2, setCurrentSlug2] = useState(-1);
    const [graphics, setGraphics] = useState([]);
    const [graphics2, setGraphics2] = useState([]);
    const [currentGraphics, setCurrentGraphics] = useState(0);
    const [currentGraphics2, setCurrentGraphics2] = useState(0);
    const [graphicsID, setGraphicsID] = useState("");
    const [currentSlugSlugName, setCurrentSlugSlugName] = useState("");

    const [copyGridSelected, setCopyGridSelected] = useState(false);



    const [stopOnNext, setStopOnNext] = useState(false);
    const [live, setLive] = useState(false);

    const [loading, setLoading] = useState(false);  // Initialize loading state to true
    const [isLoading, setIsLoading] = useState(false);

    const [flashMessage, setFlashMessage] = useState("");
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    });

    const [selectedDate2, setSelectedDate2] = useState(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    });



    //r3

    const [data, setData] = useState([])
    const [selectedProject, setSelectedProject] = useState(null)
    const [selectedScene, setSelectedScene] = useState(null)
    const [exports, setExports] = useState([])
    const [exportValues, setExportValues] = useState({})
    const [savedExportValues, setSavedExportValues] = useState({})
    const [animations, setanimations] = useState([])

    const [command, setCommand] = useState(`engine createscene "ProjectName/SceneName"`)
    const [commandResponse, setCommandResponse] = useState(``)
    const [listloadedscenes, setListloadedscenes] = useState([])
    const [searchQuery, setSearchQuery] = useState('');

    const fullstructure = () => {
        // setIsClient(true)
        fetch("/api/fullstructure")
            .then((res) => res.json())
            .then((data) => {
                setData(data.projectData);
                setAllDocs(data.allDocs || []);
                setSelectedProject(data.projectData[0]?.name || null)
            })
            .catch((err) => console.error("Failed to fetch structure", err)
            )
        getloadedscenes()
    }

    const getloadedscenes = () => {
        fetch("/api/sendCommand", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ command: `engine listloadedscenes` })
        })
            .then((res) => res.json())
            .then((data) => {
                const raw = data.responce?.response || ""
                const match = raw.match(/\[(.*?)\]/)
                const list = match?.[1]?.split(',').map(s => s.trim()) || []
                if (list.length > 0 && list[0] !== '') {
                    setListloadedscenes(list)
                }
            })
            .catch((err) => console.error("Failed to fetch scenes", err))
    }

    // r3





    useEffect(() => {
        if (
            Array.isArray(graphics) &&
            graphics.length > 0 &&
            currentGraphics >= 0 &&
            currentGraphics < graphics.length
        ) {
            const val = graphics[currentGraphics];

            if (!val?.gfxtemplatetext || val.gfxtemplatetext.trim() === "") {
                console.log("No gfxtemplatetext for graphics item:", val);
                setSavedExportValues({});
                // setExportValues({});
                return;
            }

            try {
                const parsed = JSON.parse(val.gfxtemplatetext);
                const pageValue = parsed.pageValue || {};

                setSavedExportValues(pageValue);
                // setExportValues(pageValue);
            } catch (e) {
                console.error("Invalid JSON in graphics item:", val, e);
                setSavedExportValues({});
                // setExportValues({});
            }
        } else {
            // If graphics array is empty or invalid index
            setSavedExportValues({});
            // setExportValues({});
        }
    }, [graphics, currentGraphics]);








    const handleDateChange = (event) => {
        const date = event.target.value;
        setSelectedDate(date)
    };

    const handleDateChange2 = (event) => {
        const date = event.target.value;
        setSelectedDate2(date)
    };
    const getAllKeyValue = () => {

    }

    const timerFunction = async () => {
        if (!live) return;
        await fetchRO();
        try {
            const res = await fetch(
                addressmysql() + `/getGraphics?ScriptID=${ScriptID}`
            );
            const data = await res.json();
            setGraphics(data.items);
        } catch (error) {
            // console.error('Error fetching RunOrderTitles:', error);
        }
    }

    async function fetchNewsID() {
        try {
            const res = await fetch(addressmysql() + "/getNewsID");
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

    useEffect(() => {
        if (selectedRunOrderTitle2 === "") {
            return;
        }
        async function fetchData() {
            try {
                const res = await fetch(
                    addressmysql() + `/ShowRunOrder?NewsId=${selectedRunOrderTitle2}&date=${selectedDate2}`
                );
                const data = await res.json();
                setSlugs2(data.data);
            } catch (error) {
                // console.error('Error fetching users:', error);
            }
        }

        fetchData();
    }, [selectedRunOrderTitle2, selectedDate2]);

    useEffect(() => {
        if (!ScriptID) {
            setGraphics([]); // Clear graphics when ScriptID is falsy
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        async function fetchData() {
            try {
                setLoading(true);
                setGraphics([]); // Clear graphics before fetching new data

                const res = await fetch(addressmysql() + `/getGraphics?ScriptID=${ScriptID}`, { signal });

                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();
                setGraphics(data.items);

            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Error fetching graphics:", error);
                    setGraphics([]); // Ensure graphics is empty on error
                }
            } finally {
                setLoading(false);
            }
        }

        fetchData();

        return () => controller.abort(); // Cleanup on component unmount or re-run
    }, [ScriptID]);

    // useEffect(() => {
    //     if (!ScriptID2) {
    //         setGraphics([]); // Clear graphics when ScriptID is falsy
    //         return;
    //     }

    //     const controller = new AbortController();
    //     const signal = controller.signal;

    //     async function fetchData() {
    //         try {
    //             setLoading2(true);
    //             setGraphics2([]); // Clear graphics before fetching new data
    //             const res = await fetch(addressmysql() + `/getGraphics?ScriptID=${ScriptID2}`, { signal });
    //             if (!res.ok) {
    //                 throw new Error(`HTTP error! Status: ${res.status}`);
    //             }
    //             const data = await res.json();
    //             setGraphics2(data);
    //         } catch (error) {
    //             if (error.name !== "AbortError") {
    //                 console.error("Error fetching graphics:", error);
    //                 setGraphics2([]); // Ensure graphics is empty on error
    //             }
    //         } finally {
    //             setLoading2(false);
    //         }
    //     }

    //     fetchData();

    //     return () => controller.abort(); // Cleanup on component unmount or re-run
    // }, [ScriptID2]);


    const handleSelectionChange = (e) => {
        setSelectedRunOrderTitle(e.target.value);
        setCurrentSlug(-1);
        setScriptID("");
        setCurrentSlugSlugName("");
    };
    const handleSelectionChange2 = (e) => {
        setSelectedRunOrderTitle2(e.target.value);
        setCurrentSlug2(-1);
        setScriptID2("");
    };
    const updateGraphicsToDatabase = async () => {
        if (graphicsID === '') {
            alert('no template is selected')
            return;
        }

        const newGfxText = JSON.stringify({ pageValue: savedExportValues });

        const newGraphics = graphics.map((val) =>
            val.GraphicsID === graphicsID
                ? {
                    ...val,
                    Graphicstext1: newGfxText,
                    gfxtemplatetext: newGfxText, // ensure consistency!
                }
                : val
        );

        setGraphics(newGraphics);

        try {
            await fetch(addressmysql() + "/setGraphics", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Graphicstext1: newGfxText,
                    graphicsID,
                }),
            });
        } catch (error) {
            console.error('Error saving content:', error);
        }
    };

    const copy = async () => {
        const GraphicsID = getFormattedDatetimeNumber(); // Generate GraphicsID once
        // const newGraphics = [
        //     ...graphics,
        //     {
        //         GraphicsID,
        //         Graphicstext1: JSON.stringify({ pageValue: exportValues }),
        //         GraphicsOrder: graphics.length + 1,
        //         ScriptID,
        //         GraphicsTemplate: pageName,
        //         gfxpart2: `${selectedProject}/${selectedScene}`,
        //         gfxpart3: allDocs?.find(doc => doc.SceneFullName === `${selectedProject}/${selectedScene}`)?._id?.Key2,
        //     },
        // ];
        // setGraphics(newGraphics);

        await updateCGEntry();

        const aa = slugs[currentSlug].MediaInsert;
        var bb;
        if (aa === null) {
            bb = 0;
        }
        else {
            bb = aa.split(" ")[0];
        }

        try {
            await fetch(addressmysql() + "/insertGraphics", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    GraphicsID,
                    // Graphicstext1: JSON.stringify({ pageValue: exportValues }),
                    Graphicstext1: JSON.stringify({ pageValue: savedExportValues }),
                    GraphicsOrder: parseInt(bb) + 1,
                    ScriptID: slugs[currentSlug].ScriptID,
                    GraphicsTemplate: pageName,
                    // gfxpart2: `${selectedProject}/${selectedScene}`,
                    gfxpart2: graphics[currentGraphics].gfxpart2,
                    gfxpart3: graphics[currentGraphics].gfxpart3,
                }),
            });
        } catch (error) {
            console.error('Error saving content:', error);
        }
    };


    const addNew = async () => {
        const GraphicsID = getFormattedDatetimeNumber(); // Generate GraphicsID once
        const newGraphics = [
            ...graphics,
            {
                GraphicsID,
                Graphicstext1: JSON.stringify({ pageValue: exportValues }),
                GraphicsOrder: graphics.length + 1,
                ScriptID,
                GraphicsTemplate: pageName,
                gfxpart2: `${selectedProject}/${selectedScene}`,
                gfxpart3: allDocs?.find(doc => doc.SceneFullName === `${selectedProject}/${selectedScene}`)?._id?.Key2,
            },
        ];
        setGraphics(newGraphics);

        await updateCGEntry();

        try {
            await fetch(addressmysql() + "/insertGraphics", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    GraphicsID,
                    Graphicstext1: JSON.stringify({ pageValue: exportValues }),
                    GraphicsOrder: graphics.length + 1,
                    ScriptID,
                    GraphicsTemplate: pageName,
                    gfxpart2: `${selectedProject}/${selectedScene}`,
                    gfxpart3: allDocs?.find(doc => doc.SceneFullName === `${selectedProject}/${selectedScene}`)?._id?.Key2,
                }),
            });
        } catch (error) {
            // console.error('Error saving content:', error);
        }
    };

    const updateCGEntry = async (deleteCG = false) => {
        console.log(slugs[currentSlug].MediaInsert);
        var cgValue = '';
        if (deleteCG) {
            if (slugs[currentSlug].MediaInsert === 'Visuals') {
                return;
            }
            else if (slugs[currentSlug].MediaInsert === '' || slugs[currentSlug].MediaInsert === null) {
                return;
            }
            else if (slugs[currentSlug].MediaInsert === 'Visuals/CG') {
                cgValue = 'Visuals';
            }

            else if (slugs[currentSlug].MediaInsert.includes("CG")) {
                cgValue = (graphics.length === 1) ? null : `${graphics.length - 1} CG`;
            }
            else {
                return;
            }
        }
        else {
            if (slugs[currentSlug].MediaInsert === 'Visuals') {
                cgValue = 'Visuals/CG';
            }
            else if (slugs[currentSlug].MediaInsert === '' || slugs[currentSlug].MediaInsert === null) {
                cgValue = '1 CG';
            }
            else if (slugs[currentSlug].MediaInsert === 'Visuals/CG') {
                return;
            }
            else if (slugs[currentSlug].MediaInsert.includes("CG")) {
                const aa = slugs[currentSlug].MediaInsert;
                const bb = aa.split(" ")[0];
                cgValue = `${parseInt(bb) + 1} CG`;
            }
            else {
                return;
            }
        }
        const updatedSlugs = [...slugs];
        updatedSlugs[currentSlug].MediaInsert = cgValue;
        setSlugs(updatedSlugs);
        try {
            await fetch(addressmysql() + "/updateCGEntry", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cgValue,
                    ScriptID: slugs[currentSlug].ScriptID,
                    NewsId: selectedRunOrderTitle,
                    selectedDate
                }),
            });
        } catch (error) {
            // console.error('Error saving content:', error);
        }
    }

    const deleteGraphic = async (GraphicsID) => {
        // if (graphics.length === 1) {
        await updateCGEntry(true);
        // }
        const newGraphics = graphics.filter((val) => val.GraphicsID !== GraphicsID);
        const reorderedItemsWithNewOrder = newGraphics.map((item, index) => ({
            ...item,
            GraphicsOrder: index + 1,
        }));

        setGraphics(reorderedItemsWithNewOrder);

        try {
            await fetch(`${addressmysql()}/deleteGraphics`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ GraphicsID }),
            });

            await updateGraphicsOrder(reorderedItemsWithNewOrder);
        } catch (error) {
            // console.error('Error deleting graphic:', error);
        }
    };

    const updateGraphicsOrder = async (updatedItems) => {
        const requests = updatedItems.map(async (val) => {
            try {
                await fetch(`${addressmysql()}/updateGraphicsOrder`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        GraphicsID: val.GraphicsID,
                        GraphicsOrder: val.GraphicsOrder,
                    }),
                });
            } catch (error) {
                // console.error('Error saving content:', error);
            }
        });

        await Promise.all(requests);
    };

    const handleOnDragEnd = async (result) => {
        if (!result.destination) return;
        const sourceDroppableId = result.source.droppableId;
        const destinationDroppableId = result.destination.droppableId;
        if (destinationDroppableId === 'graphics2') return;
        if ((destinationDroppableId === "graphics2") && (sourceDroppableId === "graphics2")) return;
        if ((destinationDroppableId === "graphics1") && (sourceDroppableId === "graphics2")) {
            await updateCGEntry();
        }
        if (sourceDroppableId === destinationDroppableId) {
            //update currentGraphics
            if (currentGraphics === result.source?.index) {
                setCurrentGraphics(result.destination?.index);
            }
            else if ((currentGraphics >= result.destination?.index) && (currentGraphics < result.source?.index)) {
                setCurrentGraphics(currentGraphics + 1);
            }
            else if ((currentGraphics <= result.destination?.index) && (currentGraphics > result.source?.index)) {
                setCurrentGraphics(currentGraphics - 1);
            }
            // Reordering within the same list
            const updatedItems = Array.from(
                sourceDroppableId === "graphics1" ? graphics : graphics2
            );
            const [reorderedItem] = updatedItems.splice(result.source.index, 1);
            updatedItems.splice(result.destination.index, 0, reorderedItem);

            const reorderedItemsWithNewOrder = updatedItems.map((item, index) => ({
                ...item,
                GraphicsOrder: index + 1,
            }));

            if (sourceDroppableId === "graphics1") {
                setGraphics(reorderedItemsWithNewOrder);
            } else {
                setGraphics2(reorderedItemsWithNewOrder);
            }

            await updateGraphicsOrder(reorderedItemsWithNewOrder);
        } else {
            //update currentGraphics
            if ((currentGraphics >= result.destination?.index)) {
                setCurrentGraphics(currentGraphics + 1);
            }

            // Copying between lists
            const sourceList = Array.from(
                sourceDroppableId === "graphics1" ? graphics : graphics2
            );
            const destinationList = Array.from(
                destinationDroppableId === "graphics1" ? graphics : graphics2
            );

            const [copiedItem] = sourceList.slice(
                result.source.index,
                result.source.index + 1
            );
            const newItem = {
                ...copiedItem,
                GraphicsID: getFormattedDatetimeNumber(), // Generate a new unique ID
                ScriptID: destinationDroppableId === "graphics1" ? ScriptID : ScriptID2, // Change ScriptID based on the destination list
            };

            destinationList.splice(result.destination.index, 0, newItem);
            const reorderedSourceList = sourceList.map((item, index) => ({
                ...item,
                GraphicsOrder: index + 1,
            }));

            const reorderedDestinationList = destinationList.map((item, index) => ({
                ...item,
                GraphicsOrder: index + 1,
            }));

            if (sourceDroppableId === "graphics1") {
                setGraphics(reorderedSourceList);
                setGraphics2(reorderedDestinationList);
            } else {
                setGraphics(reorderedDestinationList);
                setGraphics2(reorderedSourceList);
            }

            await updateGraphicsOrder(reorderedSourceList);
            await updateGraphicsOrder(reorderedDestinationList);

            // Optionally, save the copied item to the database
            try {
                await fetch(`${addressmysql()}/insertGraphics`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newItem),
                });
            } catch (error) {
                // console.error('Error saving copied item:', error);
            }
        }



    };

    const updateGraphicTemplate = async (GraphicsID, newTemplate) => {
        if (!GraphicsID) {
            console.error("GraphicsID is missing or invalid.");
            return;
        }

        const updatedGraphics = graphics.map((graphic) =>
            graphic.GraphicsID === GraphicsID
                ? { ...graphic, GraphicsTemplate: newTemplate }
                : graphic
        );
        setGraphics(updatedGraphics);

        try {
            const response = await fetch(addressmysql() + "/updateGraphicTemplate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ GraphicsID, GraphicsTemplate: newTemplate }),
            });

            if (!response.ok) {
                throw new Error("Failed to update graphic template on server.");
            }
        } catch (error) {
            console.error("Error updating template:", error);
        }
    };
    const handleTemplateChange = debounce((GraphicsID, newTemplate) => {
        console.log(GraphicsID);
        updateGraphicTemplate(GraphicsID, newTemplate);
    }, 100);

    const onTabChange = (index, prevIndex) => {
        switch (index) {
            case 0:
                setTimeout(() => {
                    window.dispatchEvent(new Event("resize"));
                }, 100);
                break;
            default:
            //nothing
        }
    };

    const senToSanvad = async () => {
        const res = await fetch("/api/tcp/allsamvad", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ selectedDate, selectedRunOrderTitle })
        });
    }

    const senToWtVision = async () => {
        try {
            setLoading(true);

            const res = await fetch("/api/tcp/allWtVision", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ selectedDate, selectedRunOrderTitle })
            });

            const data = await res.json();
            console.log(data);
            alert(data.message);

            // show success message or handle errors
        } catch (err) {
            alert("Error sending to WtVision.", err.error);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    return (<div>
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <div style={{ display: "flex" }}>
                <div style={{ minWidth: 450, maxWidth: 450, marginTop: 5 }}>
                    <div>
                        <div>
                            <label htmlFor="date-selector">Select a date: </label>
                            <input
                                id="date-selector"
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                            />
                            <button onClick={senToSanvad}>to Samvad</button>

                            <button
                                onClick={senToWtVision}
                                disabled={loading}
                            >
                                Send to WtVision
                            </button>
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
                            <button onClick={() => fetchNewsID()}>Refresh RO</button>
                            {slugs?.length} slugs
                            <label>
                                <input
                                    type="checkbox"
                                    checked={live}
                                    onChange={() => setLive(val => !val)}
                                />
                                Live
                            </label>
                        </div>
                        <div style={{ height: 350, overflow: "auto", border: '1px solid red' }}>
                            {slugs &&
                                slugs?.map((val, i) => (<div
                                    title={val.ScriptID}
                                    onClick={() => {
                                        setScriptID(val.ScriptID);
                                        setCurrentSlug(i);
                                        setCurrentSlugSlugName(val.SlugName);
                                        setCopyGridSelected(false);
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
                    </div>
                    <div style={{ marginTop: 20, }}>
                        <div>
                            <label htmlFor="date-selector">Select a date: </label>
                            <input
                                id="date-selector"
                                type="date"
                                value={selectedDate2}
                                onChange={handleDateChange2}
                            />

                        </div>
                        <div>
                            Run Orders:
                            <select
                                value={selectedRunOrderTitle2}
                                onChange={handleSelectionChange2}
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
                            {slugs2?.length} slugs
                            <button onClick={copy}>Copy</button>
                        </div>
                        <div style={{ height: 380, overflow: "auto", border: '1px solid red' }}>
                            {slugs2 &&
                                slugs2?.map((val, i) => (<div
                                    title={val.ScriptID}
                                    onClick={() => {
                                        setCopyGridSelected(true);
                                        setScriptID(val.ScriptID);
                                        setCurrentSlug2(i);
                                        // setCurrentSlugSlugName(val.SlugName);
                                    }}
                                    key={i} style={{
                                        display: 'flex', color: currentSlug2 === i ? "white" : "black",
                                        backgroundColor: currentSlug2 === i ? "green" : "#E7DBD8",
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
                    </div>


                </div>
                <div>
                    <Tabs
                        forceRenderTabPanel={true}
                    >
                        <TabList>
                            <Tab>Player</Tab>
                            <Tab>Templates</Tab>
                            <Tab>Script</Tab>

                        </TabList>


                        <TabPanel>

                            {loading && <LoadingModal />}

                            <div style={{ border: '1px solid blue', display: 'flex' }}>
                                <div style={{ maxHeight: 800, minHeight: 800, overflow: "auto", border: '1px solid red' }}>
                                    <Droppable droppableId="graphics1">
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                style={{ display: "flex", flexDirection: "column", gap: "12px" }}
                                            >
                                                {graphics?.length ? (
                                                    graphics.map((val, i) => (
                                                        <Draggable
                                                            key={val.GraphicsID}
                                                            draggableId={val.GraphicsID.toString()}
                                                            index={i}
                                                        >
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    style={{
                                                                        border: "1px solid #ccc",
                                                                        backgroundColor:
                                                                            currentGraphics === i ? "green" : "#E7DBD8",
                                                                        color:
                                                                            currentGraphics === i ? "white" : "black",
                                                                        padding: "10px",
                                                                        ...provided.draggableProps.style,
                                                                    }}
                                                                    onClick={async () => {
                                                                        setGraphicsID(val.GraphicsID);
                                                                        setCurrentGraphics(i);
                                                                        // setCurrentGraphics2(-1);
                                                                        setPageName(val.GraphicsTemplate + "_copy");
                                                                        // getAllKeyValue();
                                                                    }}
                                                                >
                                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                                        <span>{i + 1}</span>

                                                                        <span {...provided.dragHandleProps}>
                                                                            {!copyGridSelected && <VscMove />}
                                                                        </span>
                                                                        {!copyGridSelected && <>
                                                                            <button
                                                                                style={{ cursor: "pointer" }}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    deleteGraphic(val.GraphicsID);
                                                                                }}
                                                                            >
                                                                                <VscTrash />
                                                                            </button>
                                                                        </>}
                                                                        <input
                                                                            style={{ width: 340 }}
                                                                            type="text"
                                                                            value={val.GraphicsTemplate}
                                                                            onChange={(e) =>
                                                                                handleTemplateChange(
                                                                                    val.GraphicsID,
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        />
                                                                    </div>

                                                                    <div>  {val.gfxpart2}</div>
                                                                    <div>  {val.gfxpart3}</div>
                                                                    <div style={{ marginTop: "8px", display: 'flex', }}>
                                                                        <div >
                                                                            <img
                                                                                src={`/api/images/${val.gfxpart2.split("/")[0]}/${val.gfxpart2.split("/")[1]}/thumb.png`}
                                                                                alt="thumb"
                                                                                style={{
                                                                                    width: 300,
                                                                                    height: "auto",
                                                                                    objectFit: "contain",
                                                                                    border: "1px solid #ccc",
                                                                                    marginTop: "4px",
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <div>
                                                                                <div>
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            const [project, scene] = (val.gfxpart2 || "").split("/");
                                                                                            fetch("/api/playwithexportedvalues", {
                                                                                                method: "POST",
                                                                                                headers: { "Content-Type": "application/json" },
                                                                                                body: JSON.stringify({
                                                                                                    project,
                                                                                                    scene,
                                                                                                    timeline: "In",
                                                                                                    exportedvalues: Object.entries(savedExportValues).map(([name, value]) => ({ name, value: value.value })),

                                                                                                }),
                                                                                            });
                                                                                        }}
                                                                                        style={{ marginRight: "10px" }}
                                                                                    >
                                                                                        Play
                                                                                    </button>
                                                                                </div>
                                                                                <div>
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            const [project, scene] = (val.gfxpart2 || "").split("/");

                                                                                            fetch("/api/timeline", {
                                                                                                method: "POST",
                                                                                                headers: { "Content-Type": "application/json" },
                                                                                                body: JSON.stringify({
                                                                                                    project,
                                                                                                    scene,
                                                                                                    timeline: "Out",
                                                                                                }),
                                                                                            });
                                                                                        }}
                                                                                    >
                                                                                        Stop
                                                                                    </button>
                                                                                </div>

                                                                            </div>
                                                                        </div>

                                                                    </div>


                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))
                                                ) : (
                                                    <div>No Graphics</div>
                                                )}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                                <div style={{ height: 800, width: 1000, overflow: 'auto', border: '1px solid red' }}>
                                    <div>
                                        {graphics && graphics[currentGraphics] && (() => {
                                            const val = graphics[currentGraphics];

                                            if (!val.gfxtemplatetext) return null;

                                            let pageValue = {};

                                            try {
                                                const parsed = JSON.parse(val.gfxtemplatetext);
                                                pageValue = parsed.pageValue || {};

                                            } catch (e) {
                                                console.error("Invalid JSON:", e);
                                                return null;
                                            }

                                            return (
                                                <div style={{ border: '1px solid #ccc', }}>
                                                    <button onClick={updateGraphicsToDatabase}>
                                                        Update Graphics
                                                    </button>
                                                    <table border="1" cellPadding="8" cellSpacing="0" style={{ borderCollapse: "collapse" }}>
                                                        <thead>
                                                            <tr>
                                                                <th>Variable</th>
                                                                <th>Value</th>
                                                                <th>Type</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {Object.entries(savedExportValues).map(([key, value]) => {
                                                                const val = value || {};

                                                                const handleChange = (newVal) => {
                                                                    setSavedExportValues((prev) => ({
                                                                        ...prev,
                                                                        [key]: {
                                                                            ...prev[key],
                                                                            value: newVal,
                                                                        },
                                                                    }));
                                                                };

                                                                let inputField;

                                                                if (val.type === "String") {
                                                                    inputField = (
                                                                        <textarea
                                                                            style={{ width: 680, height: 60, resize: "vertical" }}
                                                                            value={val?.value || ""}
                                                                            onChange={(e) => handleChange(e.target.value)}
                                                                        />
                                                                    );
                                                                } else if (val.type === "Bool") {
                                                                    inputField = (
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={val?.value === true || val?.value === "true"}
                                                                            onChange={(e) => handleChange(e.target.checked)}
                                                                        />
                                                                    );
                                                                } else if (val.type === "Texture") {
                                                                    inputField = (
                                                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                                            <input
                                                                                style={{ width: 400 }}
                                                                                value={val?.value || ""}
                                                                                onChange={(e) => handleChange(e.target.value)}
                                                                            />
                                                                            <input
                                                                                type="file"
                                                                                onChange={(e) => {
                                                                                    if (e.target.files?.[0]) {
                                                                                        const fileName = e.target.files[0].name;
                                                                                        handleChange(fileName);
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    );
                                                                } else if (val.type === "ColorInt") {
                                                                    let hex = "#000000";
                                                                    if (val?.value !== undefined && val?.value !== "") {
                                                                        let intVal = parseInt(val.value);
                                                                        if (isNaN(intVal)) intVal = 0;
                                                                        hex =
                                                                            "#" +
                                                                            (intVal >>> 0)
                                                                                .toString(16)
                                                                                .padStart(8, "0")
                                                                                .slice(-6);
                                                                    }

                                                                    inputField = (
                                                                        <input
                                                                            type="color"
                                                                            value={hex}
                                                                            onChange={(e) => {
                                                                                const hexVal = e.target.value;
                                                                                const intVal = parseInt(hexVal.replace("#", ""), 16);
                                                                                handleChange(intVal.toString());
                                                                            }}
                                                                        />
                                                                    );
                                                                } else if (val.type === "Number") {
                                                                    inputField = (
                                                                        <input
                                                                            type="text"
                                                                            style={{ width: 150 }}
                                                                            value={val?.value ?? ""}
                                                                            onChange={(e) => {
                                                                                const entered = e.target.value;

                                                                                if (entered === "" || entered === "-") {
                                                                                    handleChange(entered);
                                                                                    return;
                                                                                }

                                                                                const num = parseFloat(entered);
                                                                                if (!isNaN(num)) {
                                                                                    handleChange(num);
                                                                                }
                                                                            }}
                                                                        />
                                                                    );
                                                                } else {
                                                                    inputField = (
                                                                        <input
                                                                            style={{ width: 300 }}
                                                                            value={
                                                                                typeof val?.value === "object"
                                                                                    ? JSON.stringify(val.value)
                                                                                    : val?.value || ""
                                                                            }
                                                                            onChange={(e) => {
                                                                                let inputVal = e.target.value;
                                                                                try {
                                                                                    const parsed = JSON.parse(inputVal);
                                                                                    handleChange(parsed);
                                                                                } catch {
                                                                                    handleChange(inputVal);
                                                                                }
                                                                            }}
                                                                        />
                                                                    );
                                                                }

                                                                return (
                                                                    <tr key={key}>
                                                                        <td>{key}</td>
                                                                        <td>{inputField}</td>
                                                                        <td>{val?.type || ""}</td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>

                                                    </table>
                                                </div>

                                            );
                                        })()}



                                    </div>

                                </div>

                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div style={{ border: '1px solid red' }}>
                                <div>
                                    <div style={{ display: 'flex' }}>
                                        <div style={{ border: '1px solid red', width: 250, }}>
                                            <button onClick={fullstructure}>Get Full Structure</button>

                                            <h2>Project:</h2>
                                            <select
                                                style={{ width: 240, padding: '6px 12px', marginBottom: '12px' }}
                                                value={selectedProject || ""}
                                                onChange={(e) => {
                                                    setSelectedProject(e.target.value)
                                                    setSelectedScene(null)
                                                    setExports([])
                                                    setExportValues({})
                                                    setanimations([])
                                                    // setThumbnail(null)
                                                }}
                                            >
                                                <option value="" disabled>Select</option>
                                                {data.map((project) => (
                                                    <option key={project.name} value={project.name}>{project.name}</option>
                                                ))}
                                            </select>

                                            {selectedProject && (
                                                <>
                                                    <h2>Scene:</h2>
                                                    <input
                                                        type="text"
                                                        placeholder="Search scenes..."
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        style={{
                                                            width: 200,
                                                            padding: '8px',
                                                            marginBottom: '12px',
                                                            fontSize: '16px',
                                                            borderRadius: '4px',
                                                            border: '1px solid #ccc'
                                                        }}
                                                    />
                                                    <div style={{ maxHeight: 700, overflow: 'scroll' }}>
                                                        {data
                                                            .find((p) => p.name === selectedProject)?.scenes
                                                            .filter(scene =>
                                                                scene.name.toLowerCase().includes(searchQuery.toLowerCase())
                                                            ).map(scene => (
                                                                <div
                                                                    key={scene.name}
                                                                    onClick={async () => {
                                                                        setSelectedScene(scene.name)

                                                                        const res = await fetch("/api/exports", {
                                                                            method: "POST",
                                                                            headers: { "Content-Type": "application/json" },
                                                                            body: JSON.stringify({ project: selectedProject, scene: scene.name })
                                                                        })

                                                                        const data = await res.json()

                                                                        setExports(data.exports || [])
                                                                        console.log(data)
                                                                        setanimations(data.animations || [])
                                                                        // setThumbnail(data.thumbnail || null)

                                                                        const initialValues = {};

                                                                        data.exports.forEach((exp) => {
                                                                            initialValues[exp.name] = {
                                                                                value: exp.value,
                                                                                type: exp.type
                                                                            };
                                                                        });

                                                                        setExportValues(initialValues);

                                                                    }}
                                                                    style={{
                                                                        padding: '6px 12px',
                                                                        marginBottom: '6px',
                                                                        backgroundColor: selectedScene === scene.name ? 'grey' : '#eee',
                                                                        color: selectedScene === scene.name ? 'white' : '#000',
                                                                        cursor: 'pointer',
                                                                        borderRadius: '4px',
                                                                        userSelect: 'none',
                                                                        fontSize: '20px',
                                                                    }}
                                                                >
                                                                    {scene.name}
                                                                    <img src={scene.thumbnail}></img>
                                                                </div>
                                                            ))}
                                                    </div>

                                                </>
                                            )}
                                        </div>
                                        <div style={{ border: '1px solid red', width: 850 }}>
                                            <div>
                                                <h3>Variables</h3>
                                                <button onClick={addNew}>Attach selected template to selected slug</button>
                                                {allDocs?.find(doc => doc.SceneFullName === `${selectedProject}/${selectedScene}`)?._id?.Key2}

                                                {exports.length > 0 && (
                                                    <div style={{ height: 850, overflow: 'auto' }}>
                                                        <table border="1" cellPadding="8" cellSpacing="0">
                                                            <thead>
                                                                <tr>
                                                                    <th>Variable</th>
                                                                    <th>Value</th>
                                                                    <th>Type</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {exports.map((exp) => {
                                                                    const val = exportValues[exp.name] || {};

                                                                    const handleChange = (newVal) => {
                                                                        setExportValues((prev) => ({
                                                                            ...prev,
                                                                            [exp.name]: {
                                                                                ...prev[exp.name],
                                                                                value: newVal,
                                                                            },
                                                                        }));
                                                                    };

                                                                    let inputField;

                                                                    if (exp.type === "String") {
                                                                        inputField = (
                                                                            <textarea
                                                                                style={{ width: 640, height: 60, resize: "vertical" }}
                                                                                value={val?.value || ""}
                                                                                onChange={(e) => handleChange(e.target.value)}
                                                                            />
                                                                        );
                                                                    } else if (exp.type === "Bool") {
                                                                        inputField = (
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={val?.value === true || val?.value === "true"}
                                                                                onChange={(e) => handleChange(e.target.checked)}
                                                                            />
                                                                        );
                                                                    } else if (exp.type === "Texture") {
                                                                        inputField = (
                                                                            <div
                                                                                style={{
                                                                                    display: "flex",
                                                                                    alignItems: "center",
                                                                                    gap: "8px",
                                                                                }}
                                                                            >
                                                                                <input
                                                                                    style={{ width: 400 }}
                                                                                    value={val?.value || ""}
                                                                                    onChange={(e) => handleChange(e.target.value)}
                                                                                />
                                                                                <input
                                                                                    type="file"
                                                                                    onChange={(e) => {
                                                                                        if (e.target.files?.[0]) {
                                                                                            const fileName = e.target.files[0].name;
                                                                                            handleChange(fileName);
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        );
                                                                    } else if (exp.type === "ColorInt") {
                                                                        let hex = "#000000";
                                                                        if (val?.value !== undefined && val?.value !== "") {
                                                                            let intVal = parseInt(val.value);
                                                                            if (isNaN(intVal)) intVal = 0;
                                                                            hex =
                                                                                "#" +
                                                                                (intVal >>> 0)
                                                                                    .toString(16)
                                                                                    .padStart(8, "0")
                                                                                    .slice(-6);
                                                                        }

                                                                        inputField = (
                                                                            <input
                                                                                type="color"
                                                                                value={hex}
                                                                                onChange={(e) => {
                                                                                    const hexVal = e.target.value;
                                                                                    const intVal = parseInt(hexVal.replace("#", ""), 16);
                                                                                    handleChange(intVal.toString());
                                                                                }}
                                                                            />
                                                                        );
                                                                    } else if (exp.type === "Number") {
                                                                        inputField = (
                                                                            <input
                                                                                type="text"
                                                                                style={{ width: 150 }}
                                                                                value={val?.value ?? ""}
                                                                                onChange={(e) => {
                                                                                    const entered = e.target.value;

                                                                                    if (entered === "" || entered === "-") {
                                                                                        handleChange(entered);
                                                                                        return;
                                                                                    }

                                                                                    const num = parseFloat(entered);
                                                                                    if (!isNaN(num)) {
                                                                                        handleChange(num);
                                                                                    }
                                                                                }}
                                                                            />
                                                                        );
                                                                    } else {
                                                                        inputField = (
                                                                            <input
                                                                                style={{ width: 300 }}
                                                                                value={
                                                                                    typeof val?.value === "object"
                                                                                        ? JSON.stringify(val.value)
                                                                                        : val?.value || ""
                                                                                }
                                                                                onChange={(e) => {
                                                                                    let inputVal = e.target.value;
                                                                                    try {
                                                                                        const parsed = JSON.parse(inputVal);
                                                                                        handleChange(parsed);
                                                                                    } catch {
                                                                                        handleChange(inputVal);
                                                                                    }
                                                                                }}
                                                                            />
                                                                        );
                                                                    }

                                                                    return (
                                                                        <tr key={exp.name}>
                                                                            <td>{exp.name}</td>
                                                                            <td>{inputField}</td>
                                                                            <td>{exp.type}</td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>

                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        </div>



                                        <div style={{ border: '1px solid red', width: 300 }}>

                                            <h2>Actions</h2>
                                            {selectedScene && (
                                                <div>

                                                    <div>
                                                        <button
                                                            onClick={async () => {
                                                                const updates = Object.entries(exportValues).map(([name, value]) => ({ name, value: value.value }))
                                                                const res = await fetch("/api/setExports", {
                                                                    method: "POST",
                                                                    headers: { "Content-Type": "application/json" },
                                                                    body: JSON.stringify({ project: selectedProject, scene: selectedScene, updates })
                                                                })
                                                                const result = await res.json()
                                                                console.log("Export update:", result)
                                                            }}
                                                        >
                                                            Update values
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => {
                                                            const sceneId = `${selectedProject}/${selectedScene}`
                                                            setListloadedscenes((prev) => prev.filter((item) => item !== sceneId))
                                                            fetch("/api/timeline", {
                                                                method: "POST",
                                                                headers: { "Content-Type": "application/json" },
                                                                body: JSON.stringify({ project: selectedProject, scene: selectedScene, timeline: "Out" })
                                                            })
                                                        }}
                                                    >
                                                        ⏹ Out
                                                    </button>

                                                    <div>
                                                        <button
                                                            onClick={() => {
                                                                fetch("/api/unloadAllScenes", {
                                                                    method: "POST",
                                                                    headers: { "Content-Type": "application/json" },
                                                                })
                                                                    .then((res) => res.json())
                                                                    .then(() => setListloadedscenes([]))
                                                            }}
                                                        >
                                                            🧹 Unload All Scenes
                                                        </button>
                                                    </div>

                                                    <div>
                                                        <h3>Animation</h3>
                                                        <table border="1" cellPadding="6" cellSpacing="0">
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Animation</th>
                                                                    <th>Play</th>
                                                                    <th>with new Values</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {animations.map((animation, i) => (
                                                                    <tr key={i}>
                                                                        <td>{i + 1}</td>
                                                                        <td>{animation}</td>
                                                                        <td>
                                                                            <button
                                                                                onClick={() =>
                                                                                    fetch("/api/timeline", {
                                                                                        method: "POST",
                                                                                        headers: { "Content-Type": "application/json" },
                                                                                        body: JSON.stringify({ project: selectedProject, scene: selectedScene, timeline: animation })
                                                                                    })
                                                                                        .then((res) => res.json())
                                                                                        .then(() => {
                                                                                            const sceneId = `${selectedProject}/${selectedScene}`
                                                                                            // if (!listloadedscenes.includes(sceneId)) {
                                                                                            setListloadedscenes([sceneId])
                                                                                            // }
                                                                                        })
                                                                                }
                                                                            >
                                                                                ▶️
                                                                            </button>
                                                                        </td>
                                                                        <td>
                                                                            <button
                                                                                onClick={() =>
                                                                                    fetch("/api/playwithexportedvalues", {
                                                                                        method: "POST",
                                                                                        headers: { "Content-Type": "application/json" },
                                                                                        body: JSON.stringify({
                                                                                            project: selectedProject,
                                                                                            scene: selectedScene,
                                                                                            timeline: animation,
                                                                                            exportedvalues: Object.entries(exportValues).map(([name, value]) => ({ name, value: value.value }))
                                                                                        })
                                                                                    })
                                                                                        .then((res) => res.json())
                                                                                        .then(() => {
                                                                                            const sceneId = `${selectedProject}/${selectedScene}`
                                                                                            if (!listloadedscenes.includes(sceneId)) {
                                                                                                setListloadedscenes((prev) => [...prev, sceneId])
                                                                                            }
                                                                                        })
                                                                                }
                                                                            >
                                                                                ▶️
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>

                                                    </div>

                                                    <div style={{ border: '1px solid black' }}>
                                                        <div>
                                                            <h3>Command</h3>
                                                            <textarea
                                                                style={{ width: 280, height: 100 }}
                                                                type="text"
                                                                value={command}
                                                                onChange={(e) => setCommand(e.target.value)}
                                                                placeholder="Enter command here"
                                                            />
                                                        </div>
                                                        <div>
                                                            <button
                                                                onClick={async () => {
                                                                    const res = await fetch("/api/sendCommand", {
                                                                        method: "POST",
                                                                        headers: { "Content-Type": "application/json" },
                                                                        body: JSON.stringify({ command })
                                                                    })
                                                                    const result = await res.json()
                                                                    setCommandResponse(JSON.stringify(result))
                                                                }}
                                                            >
                                                                Send Command
                                                            </button>
                                                        </div>
                                                        <h3>Response</h3>

                                                        <label>{commandResponse}</label>
                                                    </div>


                                                </div>
                                            )}
                                        </div>
                                        {/* <div style={{ border: '1px solid red', width: 400 }}>
                                    <h2>Loaded Scenes: {listloadedscenes.length}</h2>
                                    <table border="1" cellPadding="8" cellSpacing="0">
                                        <thead>
                                            <tr>
                                                <th>Loaded Scene</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listloadedscenes.map((scene, index) => (
                                                <tr key={index}>
                                                    <td>{scene}</td>
                                                    <td>
                                                        <button
                                                            onClick={() => {
                                                                setListloadedscenes((prev) => prev.filter((s) => s !== scene))
                                                                fetch("/api/timeline", {
                                                                    method: "POST",
                                                                    headers: { "Content-Type": "application/json" },
                                                                    body: JSON.stringify({
                                                                        project: scene.split('/')[0],
                                                                        scene: scene.split('/')[1],
                                                                        timeline: "Out"
                                                                    })
                                                                })
                                                            }}
                                                        >
                                                            ⏹ Out
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                </div> */}
                                    </div>


                                </div>
                            </div>
                        </TabPanel>

                        <TabPanel>
                            <div style={{ minHeight: 157, border: '1px solid red' }}>
                                <Oneliner slugs={slugs} currentStoryNumber={currentSlug} />
                            </div>
                            <div>
                                <Script
                                    ScriptID={ScriptID}
                                    title={selectedRunOrderTitle}
                                    currentSlugSlugName={currentSlugSlugName}
                                />
                            </div>
                        </TabPanel>




                    </Tabs>
                </div>
            </div>
        </DragDropContext >
        <div>
            <Timer
                callback={timerFunction}
                interval={5000}
                stopOnNext={stopOnNext}
                setStopOnNext={setStopOnNext}
            />
        </div>
        {isLoading && <Spinner />}
        {flashMessage && <FlashMessage message={flashMessage} />}

    </div >);
};

export default Nrcs2;