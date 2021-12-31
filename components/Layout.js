import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

// Proyect files
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  // Routing
  const router = useRouter();

  return (
    <>
      <Head>
        <title>CRM San Miguel</title>
        <meta charset="ISO-8859-1" />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
          integrity="sha256-l85OmPOjvil/SOvVt3HnSSjzF1TUMyT9eV0c2BzEGzU="
          crossOrigin="anonymous"
        />
        <link
          href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </Head>

      <div>
        {router.pathname === "/login" || router.pathname === "/register" ? (
          <div className="bg-gray-800 min-h-screen flex flex-col justify-center">
            {children}
          </div>
        ) : (
          <div className="bg-gray-200 min-h-screen">
            <div className="sm:flex min-h-screen">
              <Sidebar />

              <main className="sm:w-2/3 md:w-3/4 xl:w-4/5 sm:min-h-screen p-5">
                <Header />
                {children}
              </main>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Layout;
