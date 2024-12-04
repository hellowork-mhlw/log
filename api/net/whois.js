import whois from 'whois'
import { promisify } from 'util'

const lookupAsync = promisify(whois.lookup)

export async function GET(request) {
    try {
        const domain = new URL(request.url).searchParams.get('domain') ?? 'google.com'
        return new Response(await lookupAsync(domain))
    } catch (error) {
        return new Response(error.message, { status: 400 })
    }
}
