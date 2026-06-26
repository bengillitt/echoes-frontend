'use client'; // Required if you are using Next.js App Router

import { useState } from 'react';
import NewChat from "./components/NewChat";

export default function Home() {
  return (
    <NewChat />
  )
}