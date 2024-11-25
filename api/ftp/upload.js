import { Client } from 'basic-ftp'
import formidable from 'formidable'

export async function POST(request) {
    const formData = await request.formData()
    console.log(formData.get('file'))
    return new Response('ok')
    const form = formidable({})
    const client = new Client()
    client.ftp.verbose = true
    try {
        const [fields, files] = await form.parse(request)
        const options = Object.fromEntries(new URL(request.url).searchParams)
        await client.access(options)
        const info = await client.uploadFrom(files.file.filepath, files.file.originalFilename)
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