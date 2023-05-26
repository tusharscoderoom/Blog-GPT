import Post from "../Post";
import {useEffect, useState} from "react";

export default function IndexPage() {
  const [posts,setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:4000/post').then(response => {
      response.json().then(posts => {
        // console.log(posts);
        setPosts(posts);
        setLoading(false);
      });
    });
  }, []);
  return (
    <>
      {loading && <h4><i>Loading</i></h4>}
      {posts.length > 0 && !loading && posts.map(post => (
        <Post key={post._id} {...post} />
      ))}
    </>
  );
}