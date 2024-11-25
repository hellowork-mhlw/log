import { Client } from 'basic-ftp'
import { Readable } from 'node:stream'

export async function POST(request) {
    const formData = await request.formData()
    const files = formData.getAll('files')
    console.log(formData.get('files'))
    console.log(files)
    const client = new Client()
    client.ftp.verbose = true
    try {
        const options = Object.fromEntries(new URL(request.url).searchParams)
        await client.access(options)
        const messages = []
        for (const file of files) {
            console.log(file)
            const stream = Readable.from(file.stream())
            const info = await client.uploadFrom(stream, file.name)
            messages.push(info.message)
        }
        client.close()
        return Response.json({ message: messages.join('\n') })
    } catch (error) {
        client.close()
        return Response.json(error.message, { status: 400 })
    }
}

export async function OPTIONS() {
    return new Response()
}