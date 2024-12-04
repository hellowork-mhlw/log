import ping from 'ping'

export async function GET(request) {
    try {
        const host = new URL(request.url).searchParams.get('host') ?? 'google.com'
        return Response.json(await ping.promise.probe(host))
    } catch (error) {
        return Response.json(error.message, { status: 400 })
    }
}
