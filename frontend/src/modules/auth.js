/**
 * This represents some generic auth provider API, like Firebase.
 */

const MS_PER_DAY = 8.64e7

function determineLoginStatus() {
  const tokenInfo = JSON.parse(localStorage.getItem('tokenInfo'));
  if(!tokenInfo) return false 
  if(Date.now() - tokenInfo.iat > MS_PER_DAY) return false
  return true
}

export const fakeAuthProvider = {
  get isAuthenticated() { return determineLoginStatus() },
  get username() { return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).username : null},
  get token() {return JSON.parse(localStorage.getItem("token"))},
  get user() {return JSON.parse(localStorage.getItem("user"))},
  get tokenInfo() {return JSON.parse(localStorage.getItem("tokenInfo"))},
  async signin(username, password) {
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
        localStorage.setItem("token", JSON.stringify(loginResponseJson.token))
        localStorage.setItem("tokenInfo", JSON.stringify(loginResponseJson.tokenInfo))
        localStorage.setItem("user", JSON.stringify(loginResponseJson.user))
        const {isAuthenticated , username, token, tokenInfo} = this
        return {isAuthenticated, username, token, tokenInfo}
      }
    } catch (e) {
      const {isAuthenticated , username, token, tokenInfo} = this
      return {isAuthenticated, username, token, tokenInfo}
    }

  },
  async signout() {
    await new Promise((r) => setTimeout(r, 500)); // fake delay
    localStorage.clear()
  },
};