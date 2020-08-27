import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const RolesKey = 'Admin-Roles'
const StateKey = 'Admin-State'
const USER = 'user'

//token or cookie
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
//roles
export function getRoles() {
  return Cookies.get(RolesKey)
}

export function setRoles(Roles) {
  return Cookies.set(RolesKey, Roles)
}

// user
export function getUser() {
  return Cookies.get(USER);
}

export function setUser(user) {
  return Cookies.set(USER, user);
}

export function removeToken() {
  Cookies.remove(RolesKey)
  Cookies.remove(StateKey)
  return Cookies.remove(TokenKey)
}
