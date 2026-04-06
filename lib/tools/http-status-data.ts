export interface HttpStatusItem {
  code: number;
  name: string;
  description: string;
  useCase: string;
  category: "1xx" | "2xx" | "3xx" | "4xx" | "5xx";
}

export const HTTP_STATUS_DATA: HttpStatusItem[] = [
  { code: 100, name: "Continue", description: "Request headers received, continue request body.", useCase: "Large upload with Expect: 100-continue.", category: "1xx" },
  { code: 101, name: "Switching Protocols", description: "Server switches protocol as requested.", useCase: "HTTP to WebSocket upgrade.", category: "1xx" },
  { code: 102, name: "Processing", description: "Server is processing but no response yet.", useCase: "Long-running WebDAV operations.", category: "1xx" },
  { code: 103, name: "Early Hints", description: "Preload hints before final response.", useCase: "Send Link preload headers early.", category: "1xx" },

  { code: 200, name: "OK", description: "Request succeeded.", useCase: "Normal GET/POST success response.", category: "2xx" },
  { code: 201, name: "Created", description: "Resource created successfully.", useCase: "Create record via POST.", category: "2xx" },
  { code: 202, name: "Accepted", description: "Accepted for async processing.", useCase: "Queued background job.", category: "2xx" },
  { code: 204, name: "No Content", description: "Success with no response body.", useCase: "Successful DELETE.", category: "2xx" },
  { code: 206, name: "Partial Content", description: "Partial response per Range header.", useCase: "Resumable downloads/media streaming.", category: "2xx" },

  { code: 300, name: "Multiple Choices", description: "Multiple representations available.", useCase: "Content negotiation responses.", category: "3xx" },
  { code: 301, name: "Moved Permanently", description: "Permanent redirect.", useCase: "Old URL permanently replaced.", category: "3xx" },
  { code: 302, name: "Found", description: "Temporary redirect.", useCase: "Temporary route relocation.", category: "3xx" },
  { code: 303, name: "See Other", description: "Redirect with GET.", useCase: "POST-redirect-GET flow.", category: "3xx" },
  { code: 304, name: "Not Modified", description: "Cached version still valid.", useCase: "Conditional GET with ETag.", category: "3xx" },
  { code: 307, name: "Temporary Redirect", description: "Temporary redirect preserving method.", useCase: "Retry elsewhere without method change.", category: "3xx" },
  { code: 308, name: "Permanent Redirect", description: "Permanent redirect preserving method.", useCase: "Canonical URL migration.", category: "3xx" },

  { code: 400, name: "Bad Request", description: "Malformed request.", useCase: "Validation/parsing failed.", category: "4xx" },
  { code: 401, name: "Unauthorized", description: "Authentication required or failed.", useCase: "Missing/invalid token.", category: "4xx" },
  { code: 403, name: "Forbidden", description: "Authenticated but not allowed.", useCase: "Insufficient permissions.", category: "4xx" },
  { code: 404, name: "Not Found", description: "Resource does not exist.", useCase: "Unknown endpoint or ID.", category: "4xx" },
  { code: 405, name: "Method Not Allowed", description: "HTTP method not supported.", useCase: "POST sent to GET-only endpoint.", category: "4xx" },
  { code: 408, name: "Request Timeout", description: "Client request took too long.", useCase: "Slow network/client timeout.", category: "4xx" },
  { code: 409, name: "Conflict", description: "Request conflicts with current state.", useCase: "Duplicate unique resource.", category: "4xx" },
  { code: 410, name: "Gone", description: "Resource permanently removed.", useCase: "Deleted API version/resource.", category: "4xx" },
  { code: 412, name: "Precondition Failed", description: "Conditional request failed.", useCase: "ETag mismatch on update.", category: "4xx" },
  { code: 413, name: "Payload Too Large", description: "Request entity too large.", useCase: "Upload exceeds limit.", category: "4xx" },
  { code: 415, name: "Unsupported Media Type", description: "Unsupported content type.", useCase: "Invalid Content-Type header.", category: "4xx" },
  { code: 422, name: "Unprocessable Content", description: "Well-formed but semantically invalid.", useCase: "Business rule validation failed.", category: "4xx" },
  { code: 425, name: "Too Early", description: "Server unwilling to process replayable request.", useCase: "Early-data replay protection.", category: "4xx" },
  { code: 429, name: "Too Many Requests", description: "Rate limit exceeded.", useCase: "API throttling.", category: "4xx" },
  { code: 431, name: "Request Header Fields Too Large", description: "Headers too large.", useCase: "Oversized cookies/headers.", category: "4xx" },
  { code: 451, name: "Unavailable For Legal Reasons", description: "Blocked for legal reasons.", useCase: "Geo/legal takedown.", category: "4xx" },

  { code: 500, name: "Internal Server Error", description: "Unexpected server error.", useCase: "Unhandled exception.", category: "5xx" },
  { code: 501, name: "Not Implemented", description: "Feature/method not implemented.", useCase: "Endpoint planned but not built.", category: "5xx" },
  { code: 502, name: "Bad Gateway", description: "Invalid upstream response.", useCase: "Gateway/proxy upstream failure.", category: "5xx" },
  { code: 503, name: "Service Unavailable", description: "Server unavailable temporarily.", useCase: "Maintenance or overload.", category: "5xx" },
  { code: 504, name: "Gateway Timeout", description: "Upstream response timeout.", useCase: "Backend timed out.", category: "5xx" },
  { code: 505, name: "HTTP Version Not Supported", description: "HTTP protocol version unsupported.", useCase: "Old or incompatible client protocol.", category: "5xx" },
  { code: 507, name: "Insufficient Storage", description: "Server lacks storage to complete request.", useCase: "WebDAV write failed due to quota.", category: "5xx" },
  { code: 508, name: "Loop Detected", description: "Infinite loop detected during processing.", useCase: "Recursive WebDAV binding.", category: "5xx" },
  { code: 511, name: "Network Authentication Required", description: "Network authentication needed.", useCase: "Captive portal login required.", category: "5xx" },
];

