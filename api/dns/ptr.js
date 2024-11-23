import { resolve4 } from 'node:dns/promises'

export async function GET(request) {
    try {
        const info = await resolve4("example.com")
        return Response.json(info)
    } catch (error) {
        return new Response.json(error.message, { status: 400 })
    }
}