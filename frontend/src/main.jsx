import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, redirect, RouterProvider} from "react-router-dom"
import { fakeAuthProvider } from './modules/auth.js' 
import {default as App, appLoader} from "./App.jsx"
import {
  PublicPage, 
  LoginPage, loginAction, loginLoader, 
  ProtectedPage, protectedLoader,
  PostPage
} from "./Components"
import { publicPageLoader } from './Components/PublicPage.jsx'
import { commentAction } from './Components/PostPage.jsx'
/*
// comment action at some point:

await fetch(
        "http://localhost:3000/api/protected/comment", 
        {
          method: "POST",
          body: JSON.stringify({ text: "Hello" }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + JSON.parse(localStorage.getItem("token"))
          }
        },
      ).then(res => res.json()).then(console.log)


*/
const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    loader: appLoader,
    Component: App,
    children: [
      {
        id: "rootIndex",
        // loader: publicPageLoader,
        index: true,
        element: <PublicPage />
      },
      {
        path: "login",
        action: loginAction,
        loader: loginLoader,
        element: <LoginPage />,
      },
      {
        path: "protected",
        loader: protectedLoader,
        element: <ProtectedPage />,
      },
      {
        path: "posts/:postId",
        action: commentAction,
        element: <PostPage />
      },
      {
        path: "stupidworkaroundforpublicPageLoaderData",
        loader: publicPageLoader
      }
    ],
  },
  {
    path: "/logout",
    async action() {
      // We signout in a "resource route" that we can hit from a fetcher.Form
      await fakeAuthProvider.signout();
      return redirect("/");
    },
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
