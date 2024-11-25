import { Client } from 'basic-ftp'
import { Readable } from 'node:stream'

export async function POST(request) {
    const formData = await request.formData()
    const files = formData.get('files')
    console.log(files)
    const client = new Client()
    client.ftp.verbose = true
    try {
        const options = Object.fromEntries(new URL(request.url).searchParams)
        await client.access(options)
        let message = ''
        for (const file of files) {
            const stream = Readable.from(file.stream())
            const info = await client.uploadFrom(stream, file.name)
            message += info.message + '\n'
        }
        client.close()
        return Response.json({ message })
    } catch (error) {
        client.close()
        return Response.json(error.message, { status: 400 })
    }
}

export async function OPTIONS() {
    return new Response()
}