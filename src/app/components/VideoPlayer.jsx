import React, { useState } from 'react'

const VideoPlayer = () => {

    const [file, setFile] = useState(null);
    const [htmlurl, sethtmlurl] = useState('https://google.co.in');
    const [streamurl, setStreamurl] = useState('rtmp://45.116.3.113:1940/tata/livestream');
    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // store the first selected file
    };

    const handleFileChangetext = (e) => {
        sethtmlurl(e.target.value); // store the first selected file
    };
    const handleStreamChange = (e) => {
        setStreamurl(e.target.value); // store the first selected file
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
    const stopFilehtml = () => {
        fetch("/api/timeline", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ project: '25IN_ChannelPackaging_351.450', scene: 'testhtml2', timeline: "Out" })
        })
    }

    const playFilehtml = async () => {
        const exportValues = {
            url1: htmlurl,
        }
        fetch("/api/playwithexportedvalues", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                project: '25IN_ChannelPackaging_351.450',
                scene: 'testhtml2',
                timeline: 'In',
                slot: "-1",
                exportedvalues: Object.entries(exportValues).map(([name, value]) => ({ name, value }))
            })
        })
    }


    const stopStream = () => {
        fetch("/api/timeline", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ project: '25IN_ChannelPackaging_351.450', scene: 'vimlesh_stream_test1', timeline: "Out" })
        })
    }

    const playStream = async () => {
        const exportValues = {
            url1: streamurl,
        }
        fetch("/api/playwithexportedvalues", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                project: '25IN_ChannelPackaging_351.450',
                scene: 'vimlesh_stream_test1',
                timeline: 'In',
                slot: "-1",
                exportedvalues: Object.entries(exportValues).map(([name, value]) => ({ name, value }))
            })
        })
    }

    return (<>
        <div style={{ border: '1px solid red', padding: 10, margin: 10 }}>
            <h1>
                Video player
            </h1>
            <h3>Open only from c:/casparcg/_media</h3>
            <input type="file" onChange={handleFileChange} />
            {file && <button onClick={playFile}>Play file</button>}
            <button onClick={stopFile}>Stop file</button>
        </div>

        <div style={{ border: '1px solid red', padding: 10, margin: 10 }}>


            <h1>
                Html player
            </h1>
            <input style={{ width: 800 }} type="text" value={htmlurl} onChange={handleFileChangetext} />
            <button onClick={playFilehtml}>Play file</button>
            <button onClick={stopFilehtml}>Stop file</button>
        </div>

        <div style={{ border: '1px solid red', padding: 10, margin: 10 }}>


            <h1>
                Stream player
            </h1>
            <input style={{ width: 800 }} type="text" value={streamurl} onChange={handleStreamChange} />
            <button onClick={playStream}>Play file</button>
            <button onClick={stopStream}>Stop file</button>
        </div>
    </>)
}

export default VideoPlayer
