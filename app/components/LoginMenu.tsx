"use client";

import Link from "next/link";

export default function LoginMenu() {
    return (<div>
        <p>You aren't logged in</p>
        <Link href="/login">Login</Link>
        <br></br>
        <Link href="/register">Register</Link>
    </div>)
}