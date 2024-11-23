import nodemailer from 'nodemailer'

export async function POST(request) {
    try {
        const { transport, mail } = await request.json()
        const info = await nodemailer.createTransport(transport).sendMail(mail)
        return Response.json(info)
    } catch (error) {
        return new Response.json(error.message, { status: 400 })
    }
}

export async function OPTIONS() {
    return new Response()
}