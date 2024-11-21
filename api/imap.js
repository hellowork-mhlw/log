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
  
        const emails = []
  
        fetch.on('message', (msg, seqno) => {
          msg.on('body', (stream, info) => {
            simpleParser(stream, (err, parsed) => {
              if (err) {
                console.error('Error parsing email:', err)
                return
              }
              emails.push({
                subject: parsed.subject,
                from: parsed.from.text,
                date: parsed.date,
                text: parsed.text,
              })
              console.log(parsed)
            })
          })
        })
  
        fetch.once('end', () => {
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
  const url = new URL(request.url)
  const data = await handler({
    user: url.searchParams.get('user'),
    password: url.searchParams.get('password'),
    host: url.searchParams.get('host'),
    port: 993,
    tls: true,
  })

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }

  return new Response(JSON.stringify(data), { headers })
}
