import '@tanstack/vue-query'
import type { FetchError } from 'ofetch'

declare module '@tanstack/vue-query' {
  interface Register {
    // Use unknown so call sites must narrow explicitly.
    defaultError: FetchError
  }
}

