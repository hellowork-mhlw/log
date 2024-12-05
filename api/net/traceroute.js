import traceroute from "traceroute";

async function runTraceroute(target) {
  try {
    const hops = await new Promise((resolve, reject) => {
      traceroute.trace(target, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    return hops;
  } catch (error) {
    return error;
  }
}

export async function GET(request) {
    try {
        const host = new URL(request.url).searchParams.get('host') ?? 'google.com'
        return Response.json(await runTraceroute(host))
    } catch (error) {
        return Response.json(error.message, { status: 400 })
    }
}
