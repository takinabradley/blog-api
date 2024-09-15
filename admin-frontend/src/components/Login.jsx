import { redirect, useActionData, useLocation, useNavigation } from "react-router-dom"
import { Form } from "react-router-dom"
import auth from "../modules/auth"

export function loginLoader({params, request}) {
  const url = new URL(request.url)
  const redirectTo = url.searchParams.get("from") || "/"
  if(auth.isLoggedIn) return redirect(redirectTo)
  return null
}


export const loginAction = async ({params, request}) => {
  const formData = await request.formData()
  const username = formData.get("username")
  const password = formData.get("password")
  const redirectTo = formData.get("redirectTo") || "/"
  if (!username) return {error: "You must provide a username to log in"}

  if(!auth.isLoggedIn) {
    try {
      const result = await auth.login(username, password)
      if(result.isLoggedIn) return redirect(redirectTo)
      return {error: result.error}
    } catch (e) {
      return {error: e.message}
    }
  }

  
}

export default function Login() {
  const actionData = useActionData()
  const navigation = useNavigation()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  console.log(actionData)

  return (
    <div>
        <p>You must login</p>
        <Form method='post' action='/login' replace>
          <input type="hidden" name="redirectTo" value={params.get("from") || "/"} />
          <input type="text" name="username" />
          <input type="password" name="password"/>
          <button>{navigation.state !== "idle" ? "logging in..." : "login"}</button>
        </Form>
        <div className="errors">
          {actionData?.error ? actionData.error : null}
        </div>
      </div>
  )
}