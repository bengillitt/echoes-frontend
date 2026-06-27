'use client'; // Required if you are using Next.js App Router

import { useState, useEffect} from 'react';
import NewChat from "./components/NewChat";
import LoginMenu from "./components/LoginMenu";

interface User {
  username: string,
  email: string,
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      let data = await getUser();

      if (data.type != "ok") {
        return;
      }

      setUser(data);
    }

    checkUser();
  }, [])

  return (
    <div>
      {user == null ? <LoginMenu /> : <div>
        <p>Welcome back, {user.username}</p>
        <NewChat />
        </div>}
    </div>
  )
}

async function getUser() {
  try {
  let response = await fetch('http://localhost:8080/me' , {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json', // Tells the backend you are sending JSON
      },
      credentials: "include",
  });

  let data = await response.json();

  if (response.ok) {
    data.type = "ok";
  } else {
    data.type = "error";
  }

  return data;
} catch (error) {
  return {error: error as string, type: "error"};
}
}