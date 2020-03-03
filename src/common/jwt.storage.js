// From https://github.com/gothinkster/vue-realworld-example-app/blob/master/src/common/jwt.service.js
const JWT_TOKEN = 'jwt_token'
// TODO CHANGE FROM SESSIONSTORAGE TO LOCALSTORAGE

export const getToken = () => {
  return window.sessionStorage.getItem(JWT_TOKEN)
}

export const addToken = token => {
  window.sessionStorage.setItem(JWT_TOKEN, token)
}

export const deleteToken = () => {
  window.sessionStorage.removeItem(JWT_TOKEN)
}

export default { getToken, addToken, deleteToken }
