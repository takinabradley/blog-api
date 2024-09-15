import { Form, redirect, useLoaderData, useRouteLoaderData } from "react-router-dom"

export async function PostPublisherLoader() {
  try {
    const resp = await fetch(
      "http://localhost:3000/api/protected/posts",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("token"))
        }
      },
    )
    const data = await resp.json()
    return data || null
  } catch (e) {
    return null
  }
}

export async function PostPublisherAction({params, request}) {
  console.log('firing this')
  const formData = await request.formData()
  const postId = formData.get("postId")
  const published = (formData.get("published")) === "true" ? true : false
  console.log(postId, typeof published, published)
  // const post = postInfo.find(post => post._id === postId)
  try {
    if(postId && published) {
      console.log("unpublishing")
      await fetch(
        `http://localhost:3000/api/protected/posts/${postId}/unpublish`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + JSON.parse(localStorage.getItem("token"))
          }
        },
      )
    } else if (postId && !published) {
      console.log("publishing")
      await fetch(
        `http://localhost:3000/api/protected/posts/${postId}/publish`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + JSON.parse(localStorage.getItem("token"))
          }
        },
      )
    }
  } catch (e) {
    console.log(e)
    return redirect('/posts')
  }


  return redirect('/posts')
}

export default function PostPublisher() {
  const postData = useLoaderData()
  console.log("postdata is", postData)
  return (
    <div className="PostsList">
      
      {postData ? postData.posts.map(post => 
        <div key={post._id}>
          Title: {post.title} | Published: 
          <Form method="POST" action="/posts">
            <input type="hidden" name="postId" value={post._id} />
            <input type="hidden" name="published" value={post.published}/>
            <button type="submit">
              {post.published.toString()}
            </button>
          </Form>
        </div>) : null}
    </div>
    
  
  )
}