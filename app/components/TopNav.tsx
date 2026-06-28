"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function TopNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for token on mount and when path changes
        async function checkToken() {
            let response = await fetch('http://echoesapi.bengillitt.xyz/me' , {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json', // Tells the backend you are sending JSON
                },
                credentials: "include",
            });

            if (response.ok) {
                setIsLoggedIn(true);
            }
        }

      checkToken();
  }, [pathname]);

  const handleLogout = () => {
    const callLogout = async () => {
      let response = await fetch('http://echoesapi.bengillitt.xyz/logout', {
        method: 'GET',
        
        credentials: "include",
      })

      if (response.ok) {
        setIsLoggedIn(false);
        router.push("/login");
      }
    }

    callLogout();
  };

  // Optionally hide on auth pages if it feels redundant, but keeping it as requested
  if (pathname === "/login" || pathname === "/register") {
      return null;
  }

  return (
    <div className="top-nav">
      {isLoggedIn ? (
        <button className="top-nav-btn" onClick={handleLogout}>Log out</button>
      ) : (
        <div className="top-nav-links">
          <Link href="/login" className="top-nav-link">Log in</Link>
          <Link href="/register" className="top-nav-link">Register</Link>
        </div>
      )}
    </div>
  );
}
