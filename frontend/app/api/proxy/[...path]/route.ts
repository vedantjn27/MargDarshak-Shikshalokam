import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const BINARY_ENDPOINTS = ["/export"]

function isBinaryEndpoint(path: string): boolean {
  return BINARY_ENDPOINTS.some((endpoint) => path.startsWith(endpoint))
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  return proxyRequest(request, path, "GET")
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  return proxyRequest(request, path, "POST")
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  return proxyRequest(request, path, "PUT")
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  return proxyRequest(request, path, "DELETE")
}

async function proxyRequest(request: NextRequest, pathSegments: string[], method: string) {
  const path = "/" + pathSegments.join("/")
  const url = new URL(request.url)
  const queryString = url.search
  const targetUrl = `${BACKEND_URL}${path}${queryString}`

  console.log(`[Proxy] ${method} ${targetUrl}`)

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    let body: string | undefined
    if (method !== "GET" && method !== "HEAD") {
      try {
        body = await request.text()
        console.log(`[Proxy] Request body:`, body.substring(0, 500))
      } catch {
        // No body
      }
    }

    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
    })

    console.log(`[Proxy] Response status: ${response.status}`)

    const contentType = response.headers.get("Content-Type") || "application/json"
    console.log(`[Proxy] Response content-type: ${contentType}`)

    const isBinary =
      isBinaryEndpoint(path) ||
      contentType.includes("application/pdf") ||
      contentType.includes("application/vnd.openxmlformats") ||
      contentType.includes("application/vnd.ms-") ||
      contentType.includes("image/") ||
      contentType.includes("application/octet-stream")

    if (isBinary) {
      console.log(`[Proxy] Handling as binary response`)
      const arrayBuffer = await response.arrayBuffer()

      return new NextResponse(arrayBuffer, {
        status: response.status,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": response.headers.get("Content-Disposition") || "",
        },
      })
    }

    // Handle JSON/text responses
    const responseText = await response.text()
    console.log(`[Proxy] Response body:`, responseText.substring(0, 500))

    return new NextResponse(responseText, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
      },
    })
  } catch (error: any) {
    console.error(`[Proxy] Error:`, error.message)
    return NextResponse.json({ error: "Failed to connect to backend", details: error.message }, { status: 502 })
  }
}
