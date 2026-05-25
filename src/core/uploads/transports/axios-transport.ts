import { apiClient } from '../../api/client'
import type { UploadItem, UploadProgressEvent, UploadTransport } from '../types'

export interface AxiosTransportOptions {
  /** Server endpoint, e.g. '/uploads'. */
  url: string
  /** Field name used in the multipart form. Default: 'file'. */
  fieldName?: string
  /** Build extra form fields from the item (e.g. signed metadata). */
  buildFields?: (item: UploadItem) => Record<string, string | Blob>
  /** Build per-request headers from the item. */
  buildHeaders?: (item: UploadItem) => Record<string, string>
}

/**
 * Default multipart/form-data transport built on the shared axios client.
 * Host products can swap this for tus/S3/etc. by implementing UploadTransport.
 */
export function createAxiosUploadTransport<TResult = unknown>(
  options: AxiosTransportOptions,
): UploadTransport<TResult> {
  const { url, fieldName = 'file', buildFields, buildHeaders } = options
  return {
    async upload(item, onProgress, signal) {
      const form = new FormData()
      form.append(fieldName, item.file, item.file.name)
      if (buildFields) {
        for (const [k, v] of Object.entries(buildFields(item))) form.append(k, v)
      }
      const response = await apiClient.post(url, form, {
        signal,
        headers: buildHeaders?.(item),
        onUploadProgress: (e) => {
          if (!e.total) return
          const event: UploadProgressEvent = {
            id: item.id,
            loaded: e.loaded,
            total: e.total,
            progress: (e.loaded / e.total) * 100,
          }
          onProgress(event)
        },
      })
      return response.data as TResult
    },
  }
}
