import { Client } from 'basic-ftp'
import { Readable, Writable } from 'node:stream'

export async function GET(request) {
    const client = new Client()
    try {
        const options = Object.fromEntries(new URL(request.url).searchParams)
        await client.access(options)
        const writableStream = new Writable()
        await client.downloadTo(writableStream, options.filename)
        client.close()
        return new Response(Readable.from(writableStream), {
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${options.filename}"`,
            }
        })
    } catch (error) {
        client.close()
        return Response.json(error.message, { status: 400 })
    }
}
