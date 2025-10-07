import React from 'react'
import { playwithtimer } from '../lib/common';


const ScriptTest = () => {

    const [aa1, setaa1] = (React.useState('आइए, जानते हैं लिवर खराब होने के 5 सबसे बड़े कारण'))
    const [aa2, setaa2] = (React.useState('tamil தமிழகத்தில் இன்று ஓரிரு இடங்களில் லேசானது முதல்'))
    const [aa3, setaa3] = (React.useState('telugu ఓ వైపు అభయారణ్యం మరోవైపు పెద్ద పులుల ఘీంకారం'))
    const [aa4, setaa4] = (React.useState('kannad ರ ಏಷ್ಯಾ ಕಪ್‌ನಲ್ಲಿ ಭಾರತದ ವಿರುದ್ಧದ ಸತತ ಮೂರು ಸೋಲುಗಳ'))





    return (<>

        <div>ScriptTest</div>

        <input type="text" value={aa1} onChange={(e) => setaa1(e.target.value)} />
        <input type="text" value={aa2} onChange={(e) => setaa2(e.target.value)} />
        <input type="text" value={aa3} onChange={(e) => setaa3(e.target.value)} />
        <input type="text" value={aa4} onChange={(e) => setaa4(e.target.value)} />

        <button onClick={() =>
            playwithtimer({
                project: 'test', scene: "BreakingSmall_Ticker", timeline: "In", slot: "20", exportValues: { tTextA: `` }, functionName: "play_text_sequence",
                params: [
                    { interval_seconds: "2" },
                    { messages: [aa1, aa2, aa3, aa4] }
                ]
            })
        }>Play file</button>

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