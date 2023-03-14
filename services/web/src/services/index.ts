import { config } from '@/config'
import { authSlice } from '@/modules/auth/slice'
import { AppState } from '@/store/store'
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError
} from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'

export const baseQuery = fetchBaseQuery({
  baseUrl: config.api.main.baseUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const {
      authSlice: { accessToken }
    } = getState() as AppState

    if (accessToken) {
      headers.set('authorization', `${accessToken}`)
    }
    return headers
  }
})

// create a new mutex
const mutex = new Mutex()

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock()
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        const refreshResult = await baseQuery(
          'auth/refresh-token',
          api,
          extraOptions
        )
        if (refreshResult.data) {
          result = await baseQuery(args, api, extraOptions)
        } else {
          api.dispatch(authSlice.actions.logoutUser())
        }
      } finally {
        // release must be called once the mutex should be released again.
        release()
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }
  return result
}
