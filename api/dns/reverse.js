import { reverse } from 'node:dns/promises'

export async function GET(request) {
    try {
        const ip = new URL(request.url).searchParams.get('ip') ?? '8.8.8.8'
        return Response.json(await reverse(ip))
    } catch (error) {
        return Response.json(error.message, { status: 400 })
    }
}