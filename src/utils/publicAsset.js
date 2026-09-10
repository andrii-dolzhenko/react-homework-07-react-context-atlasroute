export const publicAsset = (path) => (
  `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, '')}`
)
