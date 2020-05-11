// From https://github.com/gothinkster/vue-realworld-example-app/blob/master/src/common/jwt.service.js
const JWT_TOKEN = 'jwt_token'

/**
 * Get jwt_token from localstorage
 * @returns {string} a JSON Web Token
 */
export const getToken = () => {
  return window.localStorage.getItem(JWT_TOKEN)
}

/**
 * Sets a JSON Web Token in the localstorage as jwt_token
 * @param token A JSON Web Token
 */
export const addToken = token => {
  window.localStorage.setItem(JWT_TOKEN, token)
}

/**
 * Deletes the jwt_token from localstorage
 */
export const deleteToken = () => {
  window.localStorage.removeItem(JWT_TOKEN)
}

export default { getToken, addToken, deleteToken }
