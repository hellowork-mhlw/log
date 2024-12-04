import Traceroute from 'nodejs-traceroute'

async function runTraceroute(host) {
    return new Promise((resolve, reject) => {
        try {
            const tracer = new Traceroute()
            const hops = []

            tracer
                .on('hop', (hop) => {
                    hops.push(hop)
                })
                .on('done', () => {
                    resolve(hops)
                })
                .on('error', (error) => {
                    reject(error)
                })

            tracer.trace(host)
        } catch (error) {
            reject(error)
        }
    })
}

export async function GET(request) {
    try {
        const host = new URL(request.url).searchParams.get('host') ?? 'google.com'
        return Response.json(await runTraceroute(host))
    } catch (error) {
        return Response.json(error.message, { status: 400 })
    }
}
