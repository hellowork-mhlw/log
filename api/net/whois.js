import whois from 'whois'
import { promisify } from 'util'

const lookupAsync = promisify(whois.lookup)

export async function GET(request) {
    try {
        const domain = new URL(request.url).searchParams.get('domain') ?? 'google.com'
        return Response.json(await lookupAsync(domain))
    } catch (error) {
        return Response.json(error.message, { status: 400 })
    }
}
