import { env } from "process";
import { setGlobalDispatcher, ProxyAgent, Agent } from "undici";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

export default async (req, res) => {
  const { host, url = 'https://httpbin.org/get' } = req.query
  setGlobalDispatcher(host ? new ProxyAgent(`http://${host}/`) : new Agent())
  const r = await fetch(url)
  res.status(200).send(await r.text())
}
