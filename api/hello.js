import { env } from "process";
import { setGlobalDispatcher, ProxyAgent } from "undici";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

export default async (req, res) => {
  const { host = '35.213.91.45:80' } = req.query
  setGlobalDispatcher(new ProxyAgent({uri: `http://${host}/` }))
  const r = await fetch('https://httpbin.org/get')
  res.status(200).send(await r.text())
}
