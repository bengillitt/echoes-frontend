"use client";

import {useState, useEffect} from "react";

import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [serverError, setServerError] = useState<string>("");

    const router = useRouter();

    const changeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    }

    const changeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }

    const changePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    useEffect(() => {
        async function checkToken() {
            let response = await fetch('http://localhost:8080/me' , {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json', // Tells the backend you are sending JSON
                },
                credentials: "include",
            });

            if (response.ok) {
                router.push('/');
            }
        }

        checkToken();
    }, [])

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const response = await sendRegisterToBackend({
            username: username,
            email: email,
            password: password,
        });

        if (response.type == "ok") {
            router.push("/");
        }  else {
            let errorMessage = response.error;

            setServerError(errorMessage);
        }
    }

    return (
        <div>
            <form onSubmit={handleLogin}>
                <label>username</label><br></br>
                <input type="text" placeholder="username" value={username} onChange={changeUsername} required={true}></input><br></br><br></br>
                <label>email</label><br></br>
                <input type="text" placeholder="email" value={email} onChange={changeEmail} required={true}></input><br></br><br></br>
                <label>password</label><br></br>
                <input type="password" placeholder="*********" value={password} onChange={changePassword} required={true}></input><br></br><br></br>
                {serverError == "" ? <></> : <p>{serverError}</p>}
                <input type="submit" value="register"></input>
            </form>
        </div>
    )
}

interface RegisterData {
    username: String,
    email: String,
    password: String,
}

async function sendRegisterToBackend(registerData: RegisterData) {
    try {
    const response = await fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Tells the backend you are sending JSON
      },
      body: JSON.stringify(registerData), // Converts your JS object to a JSON string,
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
        console.error("Error sending data:", error);
        return {error: error as string, type: "error"};
  }
}