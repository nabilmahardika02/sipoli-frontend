import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [counter, setCounter] = useState(0);

  return (
    <main className="w-full min-h-screen flex items-center justify-center">
      <Head>
        <title>OSIS</title>
      </Head>
      <div className="w-10 h-10 bg-white shadow-lg rounded-xl"></div>
    </main>
  );
}
