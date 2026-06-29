"use client";

import {useState, useEffect} from "react";
import Link from "next/link";

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
        <div className="auth-page">
            <div className="auth-card">
                <div>
                    <div className="auth-logo" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                        <img src="/icon.png" alt="Echoes Logo" style={{ width: "32px", height: "32px", borderRadius: "6px" }} />
                        Echoes
                    </div>
                    <p className="auth-heading">Create an account</p>
                </div>

                <div className="auth-divider" />

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="username">Username</label>
                        <input
                            id="username"
                            className="input-field"
                            type="text"
                            placeholder="your_username"
                            value={username}
                            onChange={changeUsername}
                            required={true}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            className="input-field"
                            type="text"
                            placeholder="you@example.com"
                            value={email}
                            onChange={changeEmail}
                            required={true}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-password">Password</label>
                        <input
                            id="reg-password"
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
                        Create account
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account?{" "}
                    <Link href="/login">Log in</Link>
                </p>
            </div>
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
    const response = await fetch('https://echoesapi.bengillitt.xyz/register', {
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