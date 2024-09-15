import { Link } from "react-router-dom";

export default function AdminSplash() {
  return <div>
    <ul>
      <li><Link to={"/posts"}>View Posts</Link></li>
      <li><Link to="/posts/create">Create a new post</Link></li>
      <li><Link to={"/comments"}>Manage Comments</Link></li>
    </ul>
  </div>
}