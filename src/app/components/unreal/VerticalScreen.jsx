import React, { useState } from 'react'

const VerticalScreen = ({ objectPath }) => {
    const [imageFileHandle, setImageFileHandle] = useState(null);
    const [imageFileName, setImageFileName] = useState(null);


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

    return (<>
        <div>
            <div>Image
                <button onClick={openImage}>{imageFileName ?? "Open Image"}</button>
                {imageFileHandle && <button onClick={setImage}>set Image</button>}
            </div>
        </div>
    </>)
}

export default VerticalScreen
