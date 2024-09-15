
const MS_PER_DAY = 8.64e7

function determineLoginStatus() {
  const tokenInfo = JSON.parse(localStorage.getItem('tokenInfo'));
  if(!tokenInfo) return false 
  if(Date.now() - tokenInfo.iat > MS_PER_DAY) return false
  return true
}

function updateLocalStorageWithAuthInfo({token, tokenInfo, user}) {
  localStorage.setItem("token", JSON.stringify(token))
  localStorage.setItem("tokenInfo", JSON.stringify(tokenInfo))
  localStorage.setItem("user", JSON.stringify(user))
}

export const auth = {
  get isLoggedIn() { return determineLoginStatus() },
  get username() { return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).username : null},
  get token() {return JSON.parse(localStorage.getItem("token"))},
  get user() {return JSON.parse(localStorage.getItem("user"))},
  get tokenInfo() {return JSON.parse(localStorage.getItem("tokenInfo"))},
  async login(username, password) {
    try {
      const loginResponse = await fetch(
        "http://localhost:3000/api/login", 
        {
          method: "POST",
          body: JSON.stringify({ username: username, password: password }),
          headers: {"Content-Type": "application/json"}
        },
      )
      const loginResponseJson = await loginResponse.json()

      if (loginResponseJson.success) {
        updateLocalStorageWithAuthInfo(loginResponseJson)
        const {isAuthenticated , username, token, tokenInfo} = this
        return {isAuthenticated, username, token, tokenInfo, error: ""}
      } else {
        const {isAuthenticated , username, token, tokenInfo} = this
        return {isAuthenticated, username, token, tokenInfo, error: loginResponseJson.msg}
      }
      
    } catch (e) {
      const {isAuthenticated , username, token, tokenInfo} = this
      return {isAuthenticated, username, token, tokenInfo, error: e.message}
    }

  },
  async logout() {
    localStorage.clear()
  },
};

/* const auth = {
  isLoggedIn: false,
  login() {
    this.isLoggedIn = true
  },
  logout() {
    this.isLoggedIn = false
  }
} */

export default auth