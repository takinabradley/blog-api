import { useRouteLoaderData, useFetcher, Link } from "react-router-dom";

export default function AuthStatus() {
  // Get our logged in user, if they exist, from the root route loader data
  let {isAuthenticated} = useRouteLoaderData("root")
  let fetcher = useFetcher();
  if (!isAuthenticated) {
    return <p>You are not logged in. <Link to={'/login'}>Please sign in here</Link></p>;
  }

  let isLoggingOut = fetcher.formData != null;

  return (
    <div>
      <p>Welcome, you are {isAuthenticated ? 'logged in' : 'not logged in'}!</p>
      <fetcher.Form method="post" action="/logout">
        <button type="submit" disabled={isLoggingOut}>
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </button>
      </fetcher.Form>
    </div>
  );
}