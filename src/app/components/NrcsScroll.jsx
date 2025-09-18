import React, { useState } from 'react'

const NrcsScroll = () => {

    const [NrcsBreakingText, setNrcsBreakingText] = useState(true)

    const handleChange = (event) => {
        const value = event.target.value === 'true';  // Convert string to boolean
        setNrcsBreakingText(value)
    };


    return (<>
        <div>
            <h1>
                Nrcs Scroll
            </h1>
        </div>
        <div>
            <table style={{ borderCollapse: 'collapse', width: 400 }}>
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
                            <button>Play</button>
                            <button>Stop</button>
                        </td>
                    </tr>

                    <tr>
                        <td style={{ border: '1px solid black', padding: '8px', fontWeight: 'bolder' }}>Scroll</td>
                        <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                            <button>Play</button>
                            <button>Stop</button>
                        </td>
                    </tr>

                    <tr>
                        <td style={{ border: '1px solid black', padding: '8px', fontWeight: 'bolder' }}>Lower Third
                            Breaking News</td>
                        <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                            <button>Play</button>
                            <button>Stop</button>
                        </td>
                    </tr>

                    <tr>
                        <td style={{ border: '1px solid black', padding: '8px', fontWeight: 'bolder' }}>  Full Pag
                            Breaking News</td>
                        <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                            <button>Play</button>
                            <button>Stop</button>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid black', padding: '8px', fontWeight: 'bolder' }}>News Update</td>
                        <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                            <button>Play</button>
                            <button>Stop</button>
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
                            <button>Play</button>
                            <button>Stop</button>
                        </td>
                    </tr>

                </tbody>
            </table >
        </div >

    </>)
}

export default NrcsScroll
