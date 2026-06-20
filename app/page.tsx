'use client'; // Required if you are using Next.js App Router

import { useState } from 'react';

export default function Home() {
  // 1. Create a state variable to hold the backend response text
  const [backendMessage, setBackendMessage] = useState<string>("Click the button to register...");

  // 2. Create a handler function to execute the async operation safely
  const handleRegister = async () => {
    setBackendMessage("Registering...");
    
    const result = await sendDataToBackend({
      username: "frontendUsername",
      email: "frontendUser@email.com",
      password: "password",
    });

    // Update your state with the text that came back from Rust
    setBackendMessage(result); 
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Rust + React Auth Test</h1>
      
      {/* 3. Trigger the backend call on an action */}
      <button onClick={handleRegister}>
        Register Account
      </button>

      {/* 4. Render the string message safely from state */}
      <p>Backend Status: <strong>{backendMessage}</strong></p>
    </div>
  );
}

interface UserData {
  username: string,
  email: string,
  password: string,
}

interface RegisterUserResponse {
  token: string,
}

interface ErrorResponse {
  error: string,
}

async function sendDataToBackend(userData: UserData): Promise<string> {
  try {
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json', // Tells the backend you are sending JSON
      },
      body: JSON.stringify(userData) // Converts your JS object to a JSON string
    });

    const result = await response.text();
    return result;
  } catch (error) {
    console.error("Error sending data:", error);
    return error as string;
  }
}