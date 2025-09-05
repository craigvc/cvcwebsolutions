declare global {
  var appointments: Map<string, any> | undefined
  var rateLimiters: Map<string, any> | undefined
  var authTokens: Map<string, any> | undefined
}

export {}