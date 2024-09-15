import { fakeAuthProvider } from "../modules/auth";
import { useLocation, useNavigation, useActionData, Form } from "react-router-dom";
import { redirect } from "react-router-dom";

export async function loginLoader() {
  if (fakeAuthProvider.isAuthenticated) {
    return redirect("/");
  }
  return null;
}

export async function loginAction({ request }) {
  const formData = await request.formData();
  const username = formData.get("username")
  const password = formData.get("password")

  // Validate our form inputs and return validation errors via useActionData()
  if (!username) {
    return {
      error: "You must provide a username to log in",
    };
  }

  // Sign in and redirect to the proper destination if successful.
  try {
    await fakeAuthProvider.signin(username, password);
  } catch (error) {
    // Unused as of now but this is how you would handle invalid
    // username/password combinations - just like validating the inputs
    // above
    return {
      error: "Invalid login attempt",
    };
  }

  let redirectTo = formData.get("redirectTo")
  return redirect(redirectTo || "/");
}

export default function LoginPage() {
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  let from = params.get("from") || "/";

  let navigation = useNavigation();
  let isLoggingIn = navigation.formData?.get("username") != null;

  let actionData = useActionData()

  return (
    <div>
      <p>You must log in to view the page at {from}</p>

      <Form method="post" replace>
        <input type="hidden" name="redirectTo" value={from} />
        <label>
          Username: <input name="username" />
        </label>

        <label>
          Password: <input name="password" />
        </label>

        <button type="submit" disabled={isLoggingIn}>
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>
        {actionData && actionData.error ? (
          <p style={{ color: "red" }}>{actionData.error}</p>
        ) : null}
      </Form>
    </div>
  );
}