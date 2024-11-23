import nodemailer from 'nodemailer'

export async function POST(request) {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    }

    try {
        const { transport, mail } = await request.json()
        const info = await nodemailer.createTransport(transport).sendMail(mail)
        return new Response(JSON.stringify(info), { headers })
    } catch (error) {
        return new Response(error.message, { status: 400, headers })
    }
}

export async function OPTIONS() {
    return new Response()
}