import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { ENV } from '../constants/env'
import { attachRequestInterceptor, attachResponseInterceptor } from './interceptors'
import type { ApiResponse } from '../types/api.types'

export interface CreateApiClientOptions {
  baseURL?: string
  timeout?: number
  withCredentials?: boolean
  headers?: Record<string, string>
}

export function createApiClient(options: CreateApiClientOptions = {}): AxiosInstance {
  const instance = axios.create({
    baseURL: options.baseURL ?? ENV.API_BASE_URL,
    timeout: options.timeout ?? 30_000,
    withCredentials: options.withCredentials ?? false,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
  })
  attachRequestInterceptor(instance)
  attachResponseInterceptor(instance)
  return instance
}

export const apiClient = createApiClient()

export interface RequestOptions extends AxiosRequestConfig {
  skipAuth?: boolean
}

function applyOptions(opts?: RequestOptions): AxiosRequestConfig {
  if (!opts) return {}
  const { skipAuth, ...rest } = opts
  if (skipAuth) {
    return Object.assign({}, rest, { _skipAuth: true }) as AxiosRequestConfig
  }
  return rest
}

function unwrap<T>(data: unknown): T {
  if (data && typeof data === 'object' && 'data' in (data as Record<string, unknown>)) {
    return (data as ApiResponse<T>).data
  }
  return data as T
}

export const api = {
  async get<T = unknown>(url: string, opts?: RequestOptions): Promise<T> {
    const res = await apiClient.get(url, applyOptions(opts))
    return unwrap<T>(res.data)
  },
  async post<T = unknown, B = unknown>(url: string, body?: B, opts?: RequestOptions): Promise<T> {
    const res = await apiClient.post(url, body, applyOptions(opts))
    return unwrap<T>(res.data)
  },
  async put<T = unknown, B = unknown>(url: string, body?: B, opts?: RequestOptions): Promise<T> {
    const res = await apiClient.put(url, body, applyOptions(opts))
    return unwrap<T>(res.data)
  },
  async patch<T = unknown, B = unknown>(url: string, body?: B, opts?: RequestOptions): Promise<T> {
    const res = await apiClient.patch(url, body, applyOptions(opts))
    return unwrap<T>(res.data)
  },
  async delete<T = unknown>(url: string, opts?: RequestOptions): Promise<T> {
    const res = await apiClient.delete(url, applyOptions(opts))
    return unwrap<T>(res.data)
  },
  raw: apiClient,
}
