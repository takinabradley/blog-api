import { useEffect } from "react"
import { Form, Link, useFetcher, useParams, useRouteLoaderData } from "react-router-dom"
import Post from "./Post"
import { fakeAuthProvider } from "../modules/auth"

export async function commentAction({params, request}) {
  const formData = await request.formData()
  await fetch(
    `http://localhost:3000/api/protected/post/${params.postId}/comment`, 
    {
      method: "POST",
      body: JSON.stringify({ comment: formData.get("comment") }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token"))
      }
    },
  ).then(res => res.json()).then(console.log)

  return null
}

export default function PostPage() {
  const params = useParams()
  const {blogPosts, isAuthenticated, comments} = useRouteLoaderData("root")
  console.log("COMMENTS", comments)
  const postId = params.postId
  const postsData = blogPosts || []
  const post = postsData.find(post => post._id === postId) || {}

  return (
    <div className="PostPage">
      <Link to={"/"}>Back to homepage</Link>
      <Post post={post}/>
      <div className="commentSection">
        <Form method="post">
          {
            isAuthenticated ? 
            (<>

              <label>
                Comment: 
                <textarea name="comment"></textarea>
              </label>

              <button>Submit</button>
            </>)
            : "You must log in to leave a comment"
          }
        </Form>
        
        <div className="comments">
          {comments.filter(comment => comment.post === postId).map(comment => {
            return (<div className="comment" key={comment._id}>
              <div className="comment_user">{comment.user.username}</div>
              <div className="comment_date">{new Date(comment.date).toLocaleString()}</div>
              <div className="comment_text">{comment.text}</div>
            </div>)
          })}
        </div>
      </div>
    </div>
    
  )
}