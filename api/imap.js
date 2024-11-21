import { simpleParser } from 'mailparser';
import Imap from 'imap';

async function handler() {
  console.log(process.env.IMAP_HOST)
  const imapConfig = {
    user: process.env.IMAP_USER,
    password: process.env.IMAP_PASSWORD,
    host: process.env.IMAP_HOST,
    port: 993,
    tls: true,
  };

  const imap = new Imap(imapConfig);

  imap.once('ready', () => {
    imap.openBox('INBOX', true, (err, box) => {
      if (err) {
        return;
      }

      const fetch = imap.seq.fetch('1:10', {
        bodies: '',
        struct: true,
      });

      const emails = [];

      fetch.on('message', (msg, seqno) => {
        msg.on('body', (stream, info) => {
          simpleParser(stream, (err, parsed) => {
            if (err) {
              console.error('Error parsing email:', err);
              return;
            }
            emails.push({
              subject: parsed.subject,
              from: parsed.from.text,
              date: parsed.date,
              text: parsed.text,
            });
            console.log(emails)
          });
        });
      });

      fetch.once('end', () => {
        imap.end();
      });
    });
  });

  imap.once('error', (err) => {
    console.error('IMAP error:', err);
  });

  imap.connect();
}


export async function GET(request) {
  console.log(request)
  handler()

  const data = { message: `Hello2 from ${process.env.VERCEL_REGION}` };

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }

  return new Response(JSON.stringify(data), { headers });
}
