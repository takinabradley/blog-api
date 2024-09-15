import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App, {appLoader} from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter, Form, redirect, Outlet } from 'react-router-dom'
import Counter from './components/Counter.jsx'
import Login, { loginAction, loginLoader } from './components/Login.jsx'
import auth from './modules/auth.js'
import sleep from './modules/sleep.js'
import AdminSplash from './components/AdminSplash.jsx'
import PostPublisher, { PostPublisherAction, PostPublisherLoader } from './components/PostPublisher.jsx'
import PostCommentLinks from './components/PostCommentLinks.jsx'
import PostCommentManager, { PostCommentManagerAction } from './components/PostCommentManager.jsx'
import PostCreator, { PostCreatorAction } from './components/PostCreatorl.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: appLoader,
    errorElement: "Oops! This page doesn't exist!",
    children: [
      {
        index: true,
        element: <AdminSplash />,
      },
      {
        path: "posts",
        loader: PostPublisherLoader,
        action: PostPublisherAction,
        element: <PostPublisher />
      },
      {
        path: "/comments",
        children: [
          {
            index: true,
            element: <PostCommentLinks />,
          },
          {
            path: "/comments/:postId",
            action: PostCommentManagerAction,
            element: <PostCommentManager />
          }
        ] 
      },
      {
        path: "/posts/create",
        element: <PostCreator />,
        action: PostCreatorAction
      }
    ]
  },
  {
    path: "/login",
    loader: loginLoader,
    action: loginAction,
    element: <Login />,
  },
  {
    path: "/logout",
    action: async () => {
      auth.logout()
      await sleep(3000)
      return redirect("/")
    },
    loader: async () => {
      auth.logout()
      await sleep(3000)
      return redirect("/")
    }
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
