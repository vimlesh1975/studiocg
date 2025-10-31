import { R3SpaceEngine } from 'wtv-r3-space-engine'

export async function getR3Client() {
    const host = process.env.R3_HOST || 'localhost'
    const port = parseInt(process.env.R3_PORT || '9010', 10)

    const r3 = new R3SpaceEngine(host, port)
    r3.setDebug(true)

    let connected = false

    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            console.log(`[R3] Connecting to ${host}:${port} (attempt ${attempt})...`)

            // Add a connection timeout (e.g., 5 seconds)
            await Promise.race([
                r3.connect(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Connection timed out')), 5000)
                ),
            ])

            connected = true
            console.log('[R3] Connected ✅')
            break
        } catch (err) {
            console.error(`[R3] Connection failed (attempt ${attempt}) ❌`, err.message)
            if (attempt < 3) {
                console.log('[R3] Retrying in 2 seconds...')
                await new Promise(res => setTimeout(res, 2000))
            }
        }
    }

    if (!connected) {
        throw new Error(`[R3] Unable to connect to ${host}:${port} after 3 attempts.`)
    }

    return r3
}
