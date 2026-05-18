import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'

import { paths } from '@/router'
import { msalInstance } from '@/authConfig'

async function onRequest(config: AxiosRequestConfig) {
  const account = msalInstance.getActiveAccount()

  if (account) {
    const response = await msalInstance.acquireTokenSilent({
      scopes: ['User.Read'], // Adjust scopes as needed
      account: account
    })

    config.headers = config.headers || {}
    config.headers['Authorization'] = `Bearer ${response.accessToken}`
  }

  return config as InternalAxiosRequestConfig
}

function onRequestError(error: AxiosError): Promise<AxiosError> {
  return Promise.reject(error)
}

function onResponse(response: AxiosResponse): AxiosResponse {
  return response
}

type ErrorCode = {
  code: string
}

function onResponseError(
  error: AxiosError<ErrorCode>
): Promise<AxiosError | AxiosResponse> {
  if (error?.response?.status === 401) {
    // Token is invalid/expired and MSAL couldn't refresh it
    // Redirect to login
    window.location.href = paths.LOGIN_PATH
  }

  return Promise.reject(error)
}

export function setupInterceptors(axiosInstance: AxiosInstance): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError)
  axiosInstance.interceptors.response.use(onResponse, onResponseError)

  return axiosInstance
}
