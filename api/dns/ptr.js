import { resolve4, reverse } from 'node:dns/promises'

export async function GET(request) {
    try {
        const ips = await resolve4(request.url.searchParams.get('hostname'))
        if (ips.length) {
            const hostnames = await reverse(ips[0])
            return Response.json(hostnames)
        }
        return Response.json(null, { status: 404 })
    } catch (error) {
        return Response.json(error.message, { status: 400 })
    }
}