import { Link, redirect, useLoaderData, useRouteLoaderData } from "react-router-dom"
import { fakeAuthProvider } from "../modules/auth"

export async function publicPageLoader() {
  try {
    const loginResponse = await fetch(
      "http://localhost:3000/api/posts", 
      {
        method: "get",
      },
    )
  
    const loginResponseJson = await loginResponse.json()
    return loginResponseJson.posts
  } catch (e) {
    return []
  }
} 

export default function PublicPage() {
  const {blogPosts} = useRouteLoaderData("root")
  return (
    <div className="PublicPage">
      <h3>Welcome to my blog!</h3>
      <div className="blogPosts">
        {blogPosts.map(post => (
          <div className="blogPost" key={post._id}>
            <h4><Link to={`/posts/${post._id}`}>{post.title}</Link></h4>
          </div>
        ))}
      </div>
    </div>
  )
}