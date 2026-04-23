import { createReadStream } from "node:fs"
import { access, stat } from "node:fs/promises"
import http from "node:http"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distPath = path.join(__dirname, "dist")
const port = Number(process.env.PORT || 5173)

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
}

async function fileExists(filePath) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

async function resolveFilePath(urlPath) {
  const cleanPath = path.normalize(urlPath).replace(/^(\.\.(\/|\\|$))+/, "")
  let filePath = path.join(distPath, cleanPath)

  if (await fileExists(filePath)) {
    const fileStat = await stat(filePath)

    if (fileStat.isDirectory()) {
      filePath = path.join(filePath, "index.html")
    }

    return filePath
  }

  if (path.extname(cleanPath)) {
    return null
  }

  return path.join(distPath, "index.html")
}

function sendFile(response, filePath) {
  const extension = path.extname(filePath)
  const contentType = contentTypes[extension] || "application/octet-stream"

  if (filePath.includes(`${path.sep}assets${path.sep}`)) {
    response.setHeader("Cache-Control", "public, max-age=31536000, immutable")
  }

  response.writeHead(200, { "Content-Type": contentType })
  createReadStream(filePath).pipe(response)
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url || "/", `http://${request.headers.host}`)

  if (requestUrl.pathname === "/health") {
    response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" })
    response.end("ok")
    return
  }

  const filePath = await resolveFilePath(decodeURIComponent(requestUrl.pathname))

  if (!filePath) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" })
    response.end("File not found")
    return
  }

  sendFile(response, filePath)
})

server.listen(port, "0.0.0.0", () => {
  console.log(`Server is running at http://0.0.0.0:${port}`)
})
