import {Link} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "./UserContext";

export default function Header() {
  const {setUserInfo,userInfo} = useContext(UserContext);
  useEffect(() => {
    async function fetchData() {
    const response = await fetch('http://localhost:4000/profile', {
      credentials: 'include',
    });
    const userInfo = response.json();
    setUserInfo(userInfo);
  }
  fetchData();
    // .then(response => {
    //   response.json().then(userInfo => {
    //     setUserInfo(userInfo);
    //   });
    // });
  }, []);

  function logout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">Blog GPT</Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create new post</Link>
            <Link to="/" onClick={logout}>Logout</Link>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
