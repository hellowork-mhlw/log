import traceroute from "traceroute";

async function runTraceroute(target) {
  try {
    const hops = await new Promise((resolve, reject) => {
      traceroute.trace(target, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    console.log("Traceroute result:");
    hops.forEach((hop, index) => {
      console.log(`Hop ${index + 1}:`, hop);
    });
  } catch (error) {
    console.error("Error during traceroute:", error);
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
