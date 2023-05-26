import {createContext, useEffect, useState} from "react";

export const UserContext = createContext({});

export function UserContextProvider({children}) {
  useEffect( () => {
    fetch('http://localhost:3000/')
  })
  const [userInfo,setUserInfo] = useState({});
  return (
    <UserContext.Provider value={{userInfo,setUserInfo}}>
      {children}
    </UserContext.Provider>
  );
}
