import React from 'react'
import Scroll from './components/Scroll'


const aa = 'It seems as if the boat is in the air the water is so clean and transparent. All three Pahalgam attack terrorists killed in Operation Mahadev Amit Shah tells Parliament. Umngot to Chambal Indias 5 cleanest rivers and where they are located. Home Minister Amit Shah on Tuesday, July 29 confirmed that. Mahadev on July 28 were Pahalgam terrorist attack';
const command = `SCENE "25IN_ChannelPackaging_351.450/vimlesh_ticker" Export "tScroll" SetValue "{'Group1':[{'vLeadingSpace':'0','vTrailingSpace':'0','tText':'${aa}'}]}"`

const Ticker = () => {

    const playticker = () => {

        const exportValues = {
            vSpeed: 0.01,
            vStart: true,
            vStackCount: 1,
            // vStackSize: 1,
            vReset: true,
            tText: '',
            tScroll: `{ 'Group1': [{ 'vLeadingSpace':'0', 'vTrailingSpace':'0', 'tText': '${aa}'}]}`
        }
        fetch("/api/playwithexportedvalues", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                project: '25IN_ChannelPackaging_351.450',
                scene: 'vimlesh_ticker',
                timeline: 'In',
                exportedvalues: Object.entries(exportValues).map(([name, value]) => ({ name, value }))
            })
        })
    }
    return (<>
        <div>
            <button onClick={playticker}>Play</button>
            <button
                onClick={async () => {
                    for (let i = 0; i < 1000; i++) {
                        const res = await fetch("/api/sendCommand", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ command })
                        })

                    }

                }}
            >
                Send Command
            </button>
            <Scroll />
        </div>
    </>)
}

export default Ticker