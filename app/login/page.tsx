"use client";

import {useState} from "react";

export default function LoginPage() {
    const [userIdentifier, setUserIdentifier] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const changeUserIdentifier = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserIdentifier(event.target.value);
    }

    const changePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const result = await sendLoginToBackend({
            user_identifier: userIdentifier,
            password: password,
        });

        console.log(result);
    }

    return (
        <div>
            <form onSubmit={handleLogin}>
                <label>email/username</label><br></br>
                <input type="text" placeholder="email/username" value={userIdentifier} onChange={changeUserIdentifier}></input><br></br><br></br>
                <label>password</label><br></br>
                <input type="password" placeholder="*********" value={password} onChange={changePassword}></input><br></br><br></br>
                <input type="submit" value="login"></input>
            </form>
        </div>
    )
}

interface LoginData {
    user_identifier: String,
    password: String,
}

async function sendLoginToBackend(loginData: LoginData) {
    try {
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Tells the backend you are sending JSON
      },
      body: JSON.stringify(loginData), // Converts your JS object to a JSON string,
      credentials: "include",
    });

    let json = await response.text();

    return json;
  } catch (error) {
    console.error("Error sending data:", error);
    return {error: error as string};
  }
}