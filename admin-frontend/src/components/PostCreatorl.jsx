import { Form, redirect } from "react-router-dom"
import { useState, useEffect } from "react"
import auth from "../modules/auth"

const useUser = () => {
  const [user, setUser] = useState(auth.user)

  useEffect(() => {
    setUser({username: auth.username, _id: auth.user._id})
  }, [auth.user.username, auth.user._id])

  return user
}

export async function PostCreatorAction({params, request}) {
  const formData = await request.formData()
  const title = formData.get("title")
  const text = formData.get("text")
  const published = formData.get("published") === "on" ? true : false
  const userId = formData.get("userId")
  const resp = await fetch(
    "http://localhost:3000/api/protected/posts/create",
    {
      method: "POST",
      body: JSON.stringify({title, text, published, userId}),
      headers: {
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
        "Content-Type": "application/json"
      }
    },
  )
  return redirect("/")
}

export default function PostCreator() {
  const user = useUser()
  return  <div className="PostCreator">
    <Form method="POST" action="/posts/create">
      <input type="hidden" name="userId" value={user._id}/>
      <label>
        Title  
        <input type="text" name="title" />
      </label>
      <label>
        Publish?
        <input type="checkbox" name="published"/>
      </label>
      <label>
        Post text:
        <textarea name="text"></textarea>
      </label>
      <button>submit</button>
    </Form>
  </div>
}