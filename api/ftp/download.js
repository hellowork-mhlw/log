import { Client } from 'basic-ftp'
import { PassThrough } from 'node:stream'
import { stat } from 'fs/promises'

export async function GET(request) {
    const client = new Client()
    client.ftp.verbose = true
    try {
        const options = Object.fromEntries(new URL(request.url).searchParams)
        await client.access(options)
        console.log(options.filename, new Date(), 0)
        const passThroughStream = new PassThrough()
        console.log(options.filename, new Date(), 1)
        await client.downloadTo(`/tmp/${options.filename}`, options.filename)
        console.log(options.filename, new Date(), 2)
        client.close()
        console.log(options.filename, new Date(), 3)
        return Response.json(await stat(`/tmp/${options.filename}`))
        return new Response(passThroughStream, {
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
