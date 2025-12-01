import React, { useState } from 'react'

const Genesis = ({ Heading, objectPath }) => {

    const [imageFileHandle, setImageFileHandle] = useState(null);
    const [imageFileName, setImageFileName] = useState(null);
    const [videoFileHandle, setVideoFileHandle] = useState(null);
    const [videoFileName, setVideoFileName] = useState("");
    const [loop, setLoop] = useState(true);

    async function callSet({ value, functionName, objectPath }) {
        console.log("Sending:", value)

        try {
            const res = await fetch("/api/unreal/remote/object/call", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    objectPath,
                    functionName,
                    Parameters: (typeof value == "boolean") ? { "bool": value } : { "FILE": { "FilePath": "c:/casparcg/_media/" + value } },
                    GenerateTransaction: true,
                }),
            });

            const json = await res.json().catch(() => null);
            console.log("API replied:", res.status, json);

        } catch (err) {
            console.error("Error:", err.message)
        }
    }

    const openImage = async () => {
        try {
            const [handle] = await window.showOpenFilePicker({
                types: [
                    {
                        description: "Media Only",
                        accept: {
                            "image/*": [".png", ".jpg", ".jpeg"],
                        },
                    },
                ],
                excludeAcceptAllOption: true,
                multiple: false,
            });

            // Only runs if user actually picked a file
            console.log("Picked:", handle.name);
            // setFileHandle(handle);

            setImageFileHandle(handle)
            setImageFileName(handle.name)
            callSet({ value: handle.name, functionName: "SETIMAGEFILE", objectPath })

        } catch (err) {
            // User clicked cancel
            if (err.name === "AbortError") {
                // just ignore silently
                return;
            }

            // Any real error
            console.error("Unexpected error from showOpenFilePicker:", err);
        }
    }

    const setImage = async () => {
        callSet({ value: imageFileName, functionName: "SETIMAGE", objectPath })
    }



    const openVideo = async () => {
        try {
            const [handle] = await window.showOpenFilePicker({
                types: [
                    {
                        description: "Media Only",
                        accept: {
                            "video/*": [".mp4", ".mov"],
                        },
                    },
                ],
                excludeAcceptAllOption: true,
                multiple: false,
            });

            // Only runs if user actually picked a file
            console.log("Picked:", handle.name);
            // setFileHandle(handle);

            setVideoFileHandle(handle)
            setVideoFileName(handle.name)
            callSet({ value: handle.name, functionName: "SETVIDEOFILE", objectPath })

        } catch (err) {
            // User clicked cancel
            if (err.name === "AbortError") {
                // just ignore silently
                return;
            }

            // Any real error
            console.error("Unexpected error from showOpenFilePicker:", err);
        }
    }

    const cueVideo = async () => {
        callSet({ value: '', functionName: "STANDBY_VIDEO", objectPath })
    }



    const playVideo = async () => {
        callSet({ value: loop, functionName: "Loop", objectPath })
        callSet({ value: '', functionName: "PLAYVIDEO", objectPath })
    }

    const setdecklink = (val) => {
        callSet({ value: '', functionName: `SET INPUT PIN ${val}`, objectPath })
    }
    return (<>
        <div>
            <h3> {Heading}</h3>

            <div>Image
                <button onClick={openImage}>{imageFileName ?? "Open Image"}</button>
                {imageFileHandle && <button onClick={setImage}>set Image</button>}
            </div>
            <div>Video
                <button onClick={openVideo}>{videoFileHandle ? videoFileName : "Open Video"}</button>
                {videoFileHandle && <button onClick={cueVideo}>cue Video</button>}
                {videoFileHandle && <button onClick={playVideo}>PLAY VIDEO</button>}
                {videoFileHandle && <input type='checkbox' value={loop} onChange={() => {
                    setLoop(val => !val);
                    callSet({ value: loop, functionName: "Loop", objectPath })

                }} />}


            </div>
            <div> Dcklink
                <button onClick={() => setdecklink(7)}>Decklink 7</button>
                <button onClick={() => setdecklink(8)}>Decklink 8</button>
            </div>
        </div>
    </>)
}

export default Genesis
