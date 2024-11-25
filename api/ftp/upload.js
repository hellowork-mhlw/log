import { Client } from 'basic-ftp'
import { Readable } from 'node:stream'

export async function POST(request) {
    const formData = await request.formData()
    const file = formData.get('file')
    const client = new Client()
    client.ftp.verbose = true
    try {
        const options = Object.fromEntries(new URL(request.url).searchParams)
        await client.access(options)
        const stream = Readable.from(file.stream())
        const info = await client.uploadFrom(stream, file.name)
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