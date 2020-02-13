const JWT_TOKEN = 'jwt_token'

export const getToken = () => {
  return window.localStorage.getItem(JWT_TOKEN)
}

export const addToken = token => {
  window.localStorage.setItem(JWT_TOKEN, token)
}

export const deleteToken = () => {
  window.localStorage.removeItem(JWT_TOKEN)
}

export default { getToken, addToken, deleteToken }
