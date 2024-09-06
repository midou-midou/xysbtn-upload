export const clientError = (msg) => {
  const err = new Error(msg)
  err.name = 'clientError'
  return err
}