import { Client } from 'basic-ftp'

export async function POST(request) {
    const client = new Client()
    client.ftp.verbose = true
    try {
        const { options } = await request.json()
        await client.access(options)
        const info = await client.list()
        return Response.json(info)
    } catch (error) {
        return Response.json(error.message, { status: 400 })
    }
}

export async function OPTIONS() {
    return new Response()
}