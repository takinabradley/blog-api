export default function Post({post}) {
  return <div className="Post">
        This is post {post._id}

        <h4>{post.title}</h4>
        <div className="post__author">{post.user.username}</div>
        <p>
          {post.text}
        </p>
      </div>
}