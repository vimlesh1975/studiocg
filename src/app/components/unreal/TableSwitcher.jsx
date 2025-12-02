import React, { useState } from 'react'


const tables = ['StraightSimple', 'SemiCricle', 'Sci-FiCurved']

const TableSwitcher = ({ objectPath, Heading }) => {

    const [selectedTable, setSelectedTable] = useState(tables[0]);

    async function callSet({ value, functionName, objectPath }) {
        console.log("Sending:", value)

        try {
            const res = await fetch("/api/unreal/remote/object/call", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    objectPath,
                    functionName,
                    Parameters: { Table: value },
                    GenerateTransaction: true,
                }),
            });

            const json = await res.json().catch(() => null);
            console.log("API replied:", res.status, json);

        } catch (err) {
            console.error("Error:", err.message)
        }
    }

    return (<>
        <div>
            <div>
                <h3>{Heading}</h3>
                <label>
                    Choose table:&nbsp;
                    <select
                        value={selectedTable}
                        onChange={(e) => {
                            setSelectedTable(e.target.value);
                            callSet({ value: e.target.value, functionName: "SET_TABLE", objectPath });
                        }}
                    >
                        {tables.map((table, i) => (
                            <option key={i} value={table}>
                                {table}
                            </option>
                        ))}
                    </select>
                </label>

            </div>
        </div>
    </>)
}

export default TableSwitcher
