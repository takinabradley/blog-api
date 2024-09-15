import { Link, useFetcher, useParams, Form } from "react-router-dom";
import { useEffect } from "react";

export async function PostCommentManagerAction({params, request}) {
  console.log(params)
  const formData = await request.formData()
  const commentId = formData.get('commentId')
  const resp = await fetch(
    "http://localhost:3000/api/protected/comments/" + commentId + '/delete',
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token"))
      }
    },
  )
  return null
}

export default function PostCommentManager() {
  const params = useParams()
  const postFetcher = useFetcher()
  const postId = params.postId
  const post = postFetcher?.data ? 
    postFetcher.data.posts.find(post => post._id === postId) 
    : null

  const postComments = postFetcher?.data ? 
    postFetcher.data.comments.filter(comment => comment.post === postId) 
    : null
  
  useEffect(() => {
    if(postFetcher.state === "idle" && !postFetcher.data) {
      postFetcher.load('/posts')
    }
  }, [postFetcher])
  
  
  return <div>
    <h1>{post?.title}</h1>
    <ul>
      {postComments ? 
        postComments.map(comment => 
          <li key={comment._id}>
            {comment.text} 
            <Form method="POST" action={"/comments/" + postId}>
              <input type="hidden" value={comment._id} name="commentId"/>
              <button>Delete</button>
            </Form>
          </li>) 
        : null
      }
    </ul>
  </div>

}