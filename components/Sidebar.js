import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const Sidebar = () => {
  // Routing
  const router = useRouter();

  return (
    <aside className="bg-gray-800 sm:w-1/3 md:w-1/4 xl:w-1/5 sm:min-h-screen p-5">
      <div>
        <Link href="/">
          <a className="text-white block w-full max-w-xs mx-auto mt-4">
            <img
              src="/sm_banner.png"
              className="w-full max-w-sm mx-auto mt-4"
            />
          </a>
        </Link>
      </div>

      <nav className="mt-5 list-none">
        <li className={router.pathname === "/" ? "bg-blue-800 p-2" : "p-2"}>
          <Link href="/">
            <a className="text-white block">Clients</a>
          </Link>
        </li>
        <li
          className={router.pathname === "/orders" ? "bg-blue-800 p-2" : "p-2"}
        >
          <Link href="/orders">
            <a className="text-white block">Orders</a>
          </Link>
        </li>
        <li
          className={
            router.pathname === "/products" ? "bg-blue-800 p-2" : "p-2"
          }
        >
          <Link href="/products">
            <a className="text-white block">Products</a>
          </Link>
        </li>
      </nav>

      <div className="sm:mt-10">
        <p className="text-white text-2xl font-black">Other Options</p>
      </div>
      <nav className="mt-5 list-none">
        <li
          className={
            router.pathname === "/top-vendors" ? "bg-blue-800 p-2" : "p-2"
          }
        >
          <Link href="/top-vendors">
            <a className="text-white block">Top Vendors</a>
          </Link>
        </li>
        <li
          className={
            router.pathname === "/top-clients" ? "bg-blue-800 p-2" : "p-2"
          }
        >
          <Link href="/top-clients">
            <a className="text-white block">Top Clients</a>
          </Link>
        </li>
        <li
          className={
            router.pathname === "/add-vendor" ? "bg-blue-800 p-2" : "p-2"
          }
        >
          <Link href="/add-vendor">
            <a className="text-white block">Add Vendor</a>
          </Link>
        </li>
      </nav>
    </aside>
  );
};

export default Sidebar;
