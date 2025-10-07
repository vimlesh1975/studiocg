import React from 'react'

function btoaUtf8(str) {
    return btoa(unescape(encodeURIComponent(str)));
}


const ScriptTest = () => {

    const [aa1, setaa1] = (React.useState('आइए, जानते हैं लिवर खराब होने के 5 सबसे बड़े कारण'))
    const [aa2, setaa2] = (React.useState('tamil தமிழகத்தில் இன்று ஓரிரு இடங்களில் லேசானது முதல்'))
    const [aa3, setaa3] = (React.useState('telugu ఓ వైపు అభయారణ్యం మరోవైపు పెద్ద పులుల ఘీంకారం'))
    const [aa4, setaa4] = (React.useState('kannad ರ ಏಷ್ಯಾ ಕಪ್‌ನಲ್ಲಿ ಭಾರತದ ವಿರುದ್ಧದ ಸತತ ಮೂರು ಸೋಲುಗಳ'))

    const playscripttestfile = async () => {
        console.log('object')
        const exportValues = {
            tTextA: ``,
        }
        await fetch("/api/playwithexportedvalues", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                project: "test",
                scene: "BreakingSmall_Ticker",
                timeline: 'In',
                slot: "20",
                exportedvalues: Object.entries(exportValues).map(([name, value]) => ({ name, value }))
            })
        })
        await fetch("/api/sendCommand", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ command: 'scene "test/BreakingSmall_Ticker" nodes create "texturetext" "SignalText"' }),
        });


        await fetch("/api/sendCommand", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ command: 'scene "test/BreakingSmall_Ticker" nodes add "SignalText" "RootNode"' }),
        });

        // const aa = {
        //     functionName: "move",
        //     params: [
        //         { node_name: "Quad1" },
        //         { position: [-1, 0, 0] }
        //     ]
        // };

        const aa = {
            functionName: "play_text_sequence",
            params: [
                { interval_seconds: "2" },
                { messages: [aa1, aa2, aa3, aa4] }
            ]
        };

        let parts = [`functionName:${aa.functionName}`];

        for (const p of aa.params) {
            for (const key in p) {
                const val = Array.isArray(p[key]) ? p[key].join("|||") : p[key];
                parts.push(`${key}:${val}`);
            }
        }

        const flat = parts.join("~~~");
        const encoded = btoaUtf8(flat);

        await fetch("/api/sendCommand", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                command: `scene "test/BreakingSmall_Ticker" nodes set "SignalText" "Text" "${encoded}"`
            }),
        });
    }

    return (<>

        <div>ScriptTest</div>

        <input type="text" value={aa1} onChange={(e) => setaa1(e.target.value)} />
        <input type="text" value={aa2} onChange={(e) => setaa2(e.target.value)} />
        <input type="text" value={aa3} onChange={(e) => setaa3(e.target.value)} />
        <input type="text" value={aa4} onChange={(e) => setaa4(e.target.value)} />

        <button onClick={playscripttestfile}>Play file</button>

        <button style={{ backgroundColor: 'darkred', color: 'white' }} onClick={() => {
            fetch("/api/unloadAllScenes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
        }}
        >
            🧹 Unload All Scenes</button>

    </>)
}

export default ScriptTest