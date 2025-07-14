"use client";

import { useState } from "react";

export default function Mongodb() {
    const [items, setItems] = useState([]);
    const [currentitems, setCurrentItems] = useState(null);
    const [stories, setStories] = useState([]);
    const [currentstories, setCurrentStories] = useState(null);
    const [runOrders, setRunOrders] = useState([]);
    const [currentrunOrders, setCurrentRunOrders] = useState(null);

    const getItems = () => {
        fetch("/api/mongodb/items")
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched items:", data.items);
                setItems(data.items || []);
            })
            .catch((error) => {
                console.error("Error fetching items:", error);
            });
    };

    const getStories = () => {
        fetch("/api/mongodb/stories")
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched stories:", data.stories);
                setStories(data.stories || []);
            })
            .catch((error) => {
                console.error("Error fetching stories:", error);
            });
    };

    const getRunOrders = () => {
        fetch("/api/mongodb/runorders")
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched runorders:", data.runorders);
                setRunOrders(data.runorders || []);
            })
            .catch((error) => {
                console.error("Error fetching runorders:", error);
            });
    };

    return (
        <div>
            <div
                style={{
                    padding: 20,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 20,
                }}
            >
                {/* RUN ORDERS */}
                <div
                    style={{
                        borderRight: "1px solid red",
                        paddingRight: 20,
                        width: "30%",
                        height: 800,
                        overflowY: "auto",
                    }}
                >
                    <h3>Run Orders</h3>
                    <button onClick={getRunOrders}>Get RunOrders</button>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {runOrders.map((ro, i) => (
                            <div
                                key={i}
                                onClick={() => setCurrentRunOrders(ro.MosId)}
                                style={{
                                    padding: 10,
                                    border: "1px solid #ccc",
                                    backgroundColor:
                                        currentrunOrders === ro.MosId ? "lightgreen" : "white",
                                    cursor: "pointer",
                                }}
                            >
                                <strong>{ro.MosId}</strong> — {ro.Name}
                                <button
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        try {
                                            await fetch("/api/takeshow", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({ showId: ro.MosId }),
                                            });
                                        } catch (err) { }
                                    }}
                                >
                                    Load ro on Studio CG
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* STORIES */}
                <div
                    style={{
                        borderRight: "1px solid red",
                        paddingRight: 20,
                        width: "30%",
                        height: 800,
                        overflowY: "auto",
                    }}
                >
                    <h3>Stories</h3>
                    <button onClick={getStories}>Get Stories</button>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {stories.map((story, i) => (
                            <div
                                key={i}
                                onClick={() => setCurrentStories(story.MosId)}
                                style={{
                                    padding: 10,
                                    border: "1px solid #ccc",
                                    backgroundColor:
                                        currentstories === story.MosId
                                            ? "lightgreen"
                                            : "white",
                                    cursor: "pointer",
                                }}
                            >
                                <strong>{story.MosId}</strong> — {story.Name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ITEMS */}
                <div
                    style={{
                        borderRight: "1px solid red",
                        paddingRight: 20,
                        width: "30%",
                        height: 800,
                        overflowY: "auto",
                    }}
                >
                    <h3>Items</h3>
                    <button onClick={getItems}>Get Items</button>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {items.map((item, i) => (
                            <div
                                key={i}
                                onClick={() => setCurrentItems(item.MosId)}
                                style={{
                                    border: "1px solid #ccc",
                                    padding: 10,
                                    backgroundColor:
                                        currentitems === item.MosId
                                            ? "lightgreen"
                                            : "white",
                                    cursor: "pointer",
                                }}
                            >
                                <img
                                    src={"data:image/png;base64," + item.Thumbnail}
                                    alt={item.Caption}
                                    style={{ width: 50, height: 50 }}
                                />
                                <button
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        try {
                                            await fetch("/api/takeitem", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({ itemId: item.MosId }),
                                            });
                                        } catch (err) { }
                                    }}
                                >
                                    Play on R3Engine Program
                                </button>
                                <strong>{item.MosId}</strong> — {item.Caption}{" "}
                                {item.SceneFullName}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fetch("/api/timeline", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({
                                                project: item.SceneFullName.split("/")[0],
                                                scene: item.SceneFullName.split("/")[1],
                                                timeline: "In",
                                            }),
                                        });
                                    }}
                                >
                                    Play directly on R3Engine
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
