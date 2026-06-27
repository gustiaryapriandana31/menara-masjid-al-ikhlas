import { supabase } from './supabase'

/**
 * Uploads a file to the private 'receipts' bucket on Supabase Storage.
 * @param file The file object (image) to upload.
 * @returns The internal path of the uploaded file (e.g. 'pemasukan/1719460000_abc123.jpg')
 */
export async function uploadReceipt(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'png'
  // Create a clean, unique file name using current timestamp and random alphanumeric string
  const cleanFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`
  const filePath = `pemasukan/${cleanFileName}`

  // Convert File to ArrayBuffer for uploading in a Node.js server context
  const arrayBuffer = await file.arrayBuffer()

  const { data, error } = await supabase.storage
    .from('receipts')
    .upload(filePath, arrayBuffer, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    throw new Error(`Failed to upload image to Supabase Storage: ${error.message}`)
  }

  return data.path
}

/**
 * Generates a temporary signed URL for a private file in the 'receipts' bucket.
 * @param path The internal path of the file in the bucket.
 * @param expiresIn Seconds until the URL expires (default 900 = 15 minutes).
 * @returns The secure signed URL.
 */
export async function getSignedReceiptUrl(path: string, expiresIn = 900): Promise<string> {
  const { data, error } = await supabase.storage
    .from('receipts')
    .createSignedUrl(path, expiresIn)

  if (error) {
    throw new Error(`Failed to generate secure URL: ${error.message}`)
  }

  return data.signedUrl
}
