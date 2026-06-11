import { createAdminClient } from '@/lib/supabase/admin'

export async function uploadFile(
  bucket: string,
  path: string,
  file: File | Blob,
  contentType?: string
): Promise<string> {
  const supabase = createAdminClient()
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, contentType })
  if (error) throw new Error(`Storage upload failed: ${error.message}`)
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export async function deleteFile(bucket: string, path: string): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw new Error(`Storage delete failed: ${error.message}`)
}

export function getPublicUrl(bucket: string, path: string): string {
  const supabase = createAdminClient()
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
