import { useEffect } from "react";
import { useFetcher, Link } from "react-router-dom";

export default function PostCommentLinks() {
  const postFetcher = useFetcher()

  useEffect(() => {
    if(postFetcher.state === "idle" && !postFetcher.data) {
      postFetcher.load('/posts')
    }
  }, [postFetcher])

  console.log("fetcher data", postFetcher.data)
  return <div className="CommentManager">
    Comment Manager - List of posts
    <div>{postFetcher.data === undefined ? "loading..." : null}</div>
    
    <ul>
      {postFetcher.data ? 
        postFetcher.data.posts.map(post => 
          <li key={post._id}>
            <Link to={"/comments/" + post._id}>{post.title}</Link>
          </li>
        )
        : null
      }
    </ul>
    
  </div>
}