import ping from 'net-ping'

async function pingHost(target) {
    const session = ping.createSession();

    return new Promise((resolve, reject) => {
        session.pingHost(target, (error, target) => {
            if (error) {
                reject(`${target}: ${error.toString()}`);
            } else {
                resolve(`${target}: Alive`);
            }
        });
    });
}

export async function GET(request) {
    try {
        const host = new URL(request.url).searchParams.get('host') ?? 'google.com'
        return Response.json(await pingHost(host))
    } catch (error) {
        return Response.json(error.message, { status: 400 })
    }
}
