export const cloudinaryFormDataFnct = async () => {
  const folder = import.meta.env.PUBLIC_CLOUDINARY_IMGS_FOLDER

  const formData = new FormData()

  formData.append('timestamp', Date.now().toString())
  formData.append('upload_preset', folder)
  formData.append('folder', folder)

  return formData
}
