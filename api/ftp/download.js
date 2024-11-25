import mime from 'mime-types'
import { Client } from 'basic-ftp'
import { readFile } from 'fs/promises'


export async function GET(request) {
    const client = new Client()
    client.ftp.verbose = true
    try {
        const options = Object.fromEntries(new URL(request.url).searchParams)
        await client.access(options)
        const filepath = '/tmp/' + Date.now()
        await client.downloadTo(filepath, options.filename)
        client.close()
        return new Response(await readFile(filepath), {
            headers: {
                'Content-Type': mime.lookup(options.filename) || 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${encodeURIComponent(options.filename)}"`,
            }
        })
    } catch (error) {
        client.close()
        return Response.json(error.message, { status: 400 })
    }
}
