import { simpleParser } from 'mailparser'
import Imap from 'imap'

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
  
        const fetch = imap.seq.fetch('1:10', {
          bodies: '',
          struct: true,
        })
  
        const emailPromises = []
  
        fetch.on('message', (msg, seqno) => {
          emailPromises.push(new Promise(resolve2 => {
            msg.on('body', (stream, info) => simpleParser(stream, resolve2))
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


export async function GET(request) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
  const url = new URL(request.url)
  try {
    const data = await handler({
      user: url.searchParams.get('user'),
      password: url.searchParams.get('password'),
      host: url.searchParams.get('host'),
      port: 993,
      tls: true,
    })
    return new Response(JSON.stringify(data), { headers })
  } catch (error) {
    return new Response(JSON.stringify(error.message), { status: 400, headers })
  }
}
