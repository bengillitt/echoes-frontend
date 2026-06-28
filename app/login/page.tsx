"use client";

import {useState, useEffect} from "react";
import Link from "next/link";

import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [userIdentifier, setUserIdentifier] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [serverError, setServerError] = useState<string>("");

    const router = useRouter();

    const changeUserIdentifier = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserIdentifier(event.target.value);
    }

    const changePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    useEffect(() => {
        async function checkToken() {
            let response = await fetch('https://echoesapi.bengillitt.xyz/me' , {
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

        const response = await sendLoginToBackend({
            user_identifier: userIdentifier,
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
        <div className="auth-page">
            <div className="auth-card">
                <div>
                    <div className="auth-logo">Echoes</div>
                    <p className="auth-heading">Welcome back</p>
                </div>

                <div className="auth-divider" />

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="user-identifier">Email / Username</label>
                        <input
                            id="user-identifier"
                            className="input-field"
                            type="text"
                            placeholder="you@example.com"
                            value={userIdentifier}
                            onChange={changeUserIdentifier}
                            required={true}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            className="input-field"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={changePassword}
                            required={true}
                        />
                    </div>

                    {serverError !== "" && <p className="error-text">{serverError}</p>}

                    <button type="submit" className="btn-primary" style={{ marginTop: "0.25rem" }}>
                        Log in
                    </button>
                </form>

                <p className="auth-footer">
                    Don&apos;t have an account?{" "}
                    <Link href="/register">Register</Link>
                </p>
            </div>
        </div>
    )
}

interface LoginData {
    user_identifier: String,
    password: String,
}

async function sendLoginToBackend(loginData: LoginData) {
    try {
    const response = await fetch('https://echoesapi.bengillitt.xyz/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Tells the backend you are sending JSON
      },
      body: JSON.stringify(loginData), // Converts your JS object to a JSON string,
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