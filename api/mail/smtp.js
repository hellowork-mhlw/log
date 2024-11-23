import nodemailer from 'nodemailer'

export async function POST(request) {
    try {
        const { transport, mail } = await request.json()
        return Response.json(await nodemailer.createTransport(transport).sendMail(mail))
    } catch (error) {
        return new Response(error.message, { status: 400 })
    }
}

export async function OPTIONS() {
    return new Response()
}