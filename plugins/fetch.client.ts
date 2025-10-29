export default defineNuxtPlugin(() => {
  const originalFetch = window.$fetch

  const enhancedFetch = ((...args: Parameters<typeof originalFetch>) => {
    try {
      const token = useCookie('token').value
      const [request, options = {}] = args
      const fetchOptions = {
        ...options,
        headers: {
          ...options.headers,
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
      return originalFetch(request, fetchOptions)
    }
    catch (error: unknown) {
      throw error instanceof Error
    }
  }) as typeof originalFetch
  enhancedFetch.raw = originalFetch.raw
  enhancedFetch.create = originalFetch.create
  window.$fetch = enhancedFetch
})
