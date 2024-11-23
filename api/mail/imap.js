import Imap from 'imap'
import { simpleParser } from 'mailparser'

async function handler(imapConfig) {
    return new Promise((resolve, reject) => {
        const imap = new Imap(imapConfig)
        imap.once('ready', () => {
            imap.openBox('INBOX', true, (error, box) => {
                if (error) {
                    console.error('INBOX error:', error)
                    reject(error)
                    return
                }

                const fetch = imap.seq.fetch(`${Math.max(1, box.messages.total - 9)}:*`, {
                    bodies: '',
                    struct: true,
                })

                const emailPromises = []

                fetch.on('message', (msg, seqno) => {
                    emailPromises.push(new Promise(resolve2 => {
                        msg.on('body', (stream, info) => simpleParser(stream, (error, parsed) => resolve2({ error, parsed })))
                    }))
                })

                fetch.once('end', async () => {
                    const emails = await Promise.all(emailPromises)
                    imap.end()
                    resolve(emails)
                })
            })
        })

        imap.once('error', (error) => {
            console.error('IMAP error:', error)
            reject(error)
        })

        imap.connect()
    })
}

export async function POST(request) {
    try {
        const { transport } = await request.json()
        const data = await handler(transport)
        return Response.json(data)
    } catch (error) {
        return Response.json(error.message, { status: 400 })
    }
}

export async function OPTIONS() {
    return new Response()
}