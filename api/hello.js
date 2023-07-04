import { env } from "process";
import { setGlobalDispatcher, ProxyAgent } from "undici";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

export default async (req, res) => {
  const { host, url = 'https://httpbin.org/get' } = req.query
  setGlobalDispatcher(new ProxyAgent(host ? `http://${host}/` : ''))
  const r = await fetch(url)
  res.status(200).send(await r.text())
}
