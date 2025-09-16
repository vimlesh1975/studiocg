import React, { useState } from 'react'

const VideoPlayer = () => {

    const [file, setFile] = useState(null);
    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // store the first selected file
    };

    const playFile = async () => {
        const exportValues = {
            video: `c:/casparcg/_media/${file.name}`,
        }
        fetch("/api/playwithexportedvalues", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                project: '25IN_ChannelPackaging_351.450',
                scene: 'vimlesh_video',
                timeline: 'In',
                slot: "-1",
                exportedvalues: Object.entries(exportValues).map(([name, value]) => ({ name, value }))
            })
        })
    }
    const stopFile = () => {
        fetch("/api/timeline", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ project: '25IN_ChannelPackaging_351.450', scene: 'vimlesh_video', timeline: "Out" })
        })
    }



    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            {file && <button onClick={playFile}>Play file</button>}
            <button onClick={stopFile}>Stop file</button>
            {file?.name}
        </div>
    )
}

export default VideoPlayer
