import { fakeAuthProvider } from "../modules/auth";
import { redirect } from "react-router-dom";
export function protectedLoader({ request }) {
  // If the user is not logged in and tries to access `/protected`, we redirect
  // them to `/login` with a `from` parameter that allows login to redirect back
  // to this page upon successful authentication
  if (!fakeAuthProvider.isAuthenticated) {
    let params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }
  return null;
}

export default function ProtectedPage() {
  return <h3>This is the protected page</h3>;
}