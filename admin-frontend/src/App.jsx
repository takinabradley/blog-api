/* import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg' */
import './App.css'
import { Form, Link, Outlet, redirect, useLoaderData, useNavigation } from 'react-router-dom'
import auth from './modules/auth'
import { useEffect,  useState } from 'react'



export const appLoader = ({params, request}) => {
  const url = new URL(request.url)
  const everythingFromFirstSlash = url.href.split(url.host)[1]
  if(!auth.isLoggedIn) {
    auth.logout()
    return redirect('/login?from=' + everythingFromFirstSlash)
  }
  return auth.isLoggedIn
}

function App() {

  return (
   <>
      <div className="banner">
        <ul>

          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to={"/logout"}>Logout</Link>
          </li>
        </ul>
      </div>
      <Outlet />
      <div className="footer">
      </div>
   </>
  )
}

export default App
