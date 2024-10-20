export const cloudinaryFormDataFnct = async ({
  apiKey,
  folder,
}: {
  apiKey: string
  folder: string
}) => {
  const formData = new FormData()

  formData.append('timestamp', Date.now().toString())
  formData.append('upload_preset', folder)
  formData.append('api_key', apiKey)
  formData.append('folder', folder)

  return formData
}
