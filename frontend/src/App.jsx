import { Link, Outlet, redirect, useRouteLoaderData } from "react-router-dom";
import { fakeAuthProvider } from "./modules/auth";
import {AuthStatus} from './Components'

/* function useLocalStorage(key) {
  const [storageItem, setStorageItem] = useState(JSON.parse(localStorage.getItem(key)))

  const updateStorageItem = (value) => {
    localStorage.setItem(key, JSON.stringify(value))
    setStorageItem(JSON.parse(localStorage.getItem(key)))
  }

  const removeStorageItem = () => {
    localStorage.removeItem(key)
    setStorageItem(null)
  }

  return [storageItem, updateStorageItem, removeStorageItem]
} */

export async function appLoader() {
  const isAuthenticated = fakeAuthProvider.isAuthenticated
  const postResponse = await fetch("http://localhost:3000/api/posts")
  let blogPosts = []
  let comments = []
  if(postResponse.ok) {
    const responseJson = await postResponse.json()
    blogPosts = responseJson.posts
    comments = responseJson.comments
  }

  return {
    isAuthenticated,
    blogPosts,
    comments
  }
}

export default function App() {
  return (
    <div>
      <AuthStatus />
      <Outlet />
    </div>
  );
}








