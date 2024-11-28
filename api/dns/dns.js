import { resolve } from 'node:dns/promises'

export async function GET(request) {
    try {
        const hostname = new URL(request.url).searchParams.get('hostname') ?? 'example.com'
        const rrtype = new URL(request.url).searchParams.get('rrtype') ?? 'ANY'
        return Response.json(await resolve(hostname, rrtype))
    } catch (error) {
        return Response.json(error.message, { status: 400 })
    }
}
