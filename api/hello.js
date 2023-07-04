export default async (req, res) => {
  const { name = 'World' } = req.query
  const r = await fetch('https://httpbin.org/get')
  res.status(200).send(await r.text())
}
