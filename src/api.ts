import http from 'http'
import { parse } from 'yaml'
import { getConfig, updateConfig } from './config'

const host = 'localhost'
const port = 14201

const putConfig = (configYaml: string) => {
  const config = parse(configYaml)
  updateConfig(config)
}

const server = http.createServer((req, res) => {
  if (req.method !== 'PUT') {
    res.writeHead(404)
    res.end('')
    return
  }

  if (req.url !== '/config') {
    res.writeHead(404)
    res.end('')
    return
  }

  const { gatewayApiKey } = getConfig()
  if (req.headers['apikey'] !== gatewayApiKey) {
    res.writeHead(401)
    res.end('')
    return
  }

  let body = ''
  req.on('data', chunk => {
    body += chunk
  })
  req.on('end', () => {
    putConfig(body)
    res.writeHead(200)
    res.end()
  })
})

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`)
})
