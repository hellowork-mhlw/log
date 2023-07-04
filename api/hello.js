import { env } from "process";
import { setGlobalDispatcher, ProxyAgent } from "undici";

const https_proxy = 'http://35.213.91.45:80'

if (https_proxy) {
  // Corporate proxy uses CA not in undici's certificate store
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const dispatcher = new ProxyAgent({uri: new URL(https_proxy).toString() });
  setGlobalDispatcher(dispatcher);
}

export default async (req, res) => {
  const { name = 'World' } = req.query
  const r = await fetch('https://httpbin.org/get')
  res.status(200).send(await r.text())
}
