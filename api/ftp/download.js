import { Client } from 'basic-ftp'
import { Writable } from 'node:stream'

export async function GET(request) {
    const client = new Client()
    try {
        const options = Object.fromEntries(new URL(request.url).searchParams)
        await client.access(options)
        const writeStream = new Writable()
        await client.downloadTo(writeStream, options.filename)
        client.close()
        return new Response(writeStream, {
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
