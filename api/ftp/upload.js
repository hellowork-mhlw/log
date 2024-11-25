import { Client } from 'basic-ftp'
import { Readable } from 'node:stream'

export async function POST(request) {
    const client = new Client()
    client.ftp.verbose = true
    try {
        const options = Object.fromEntries(new URL(request.url).searchParams)
        await client.access(options)
        const blob = await request.blob()
        const stream = Readable.from(blob.stream())
        const info = await client.uploadFrom(stream, 'hogehoge.txt')
        client.close()
        return Response.json(info)
    } catch (error) {
        client.close()
        return Response.json(error.message, { status: 400 })
    }
}

export async function OPTIONS() {
    return new Response()
}