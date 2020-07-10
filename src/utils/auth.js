import Cookies from 'js-cookie';

const TokenKey = 'health-h5-Token'
const RolesKey = 'health-h5-Roles'
const StateKey = 'health-h5-State'
//token or cookie
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
