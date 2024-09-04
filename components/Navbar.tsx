"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CircleUser,
  Headset,
  Images,
  Menu,
  PersonStanding,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <div className="hidden relative py-6 sm:flex flex-col justify-center shadow-md h-16 z-10 top-0 left-0 right-0 px-4 sm:px-0">
        {/* <LogoLink /> */}
        <DesktopNavbar />
      </div>
      <div className="sm:hidden relative flex flex-row py-8 shadow-md h-12">
        {/* <LogoLink /> */}
        <button
          className="absolute right-2 top-2 p-3"
          onClick={handleDrawerToggle}
        >
          <Menu />
        </button>
        <MobileDrawer isOpen={isDrawerOpen} onClose={handleDrawerToggle} />
      </div>
    </>
  );
};

// TODO: Add LogoLink component

export default Navbar;

function DesktopNavbar() {
  return (
    <ul className="absolute right-0 flex flex-row space-x-8 px-4 ">
      <NavLink href="/galleries">
        <div className="flex items-center justify-center">
          <Images className="h-4" />
          galleries
        </div>
      </NavLink>
      <NavLink href="/account">
        <div className="flex items-center justify-center">
          <CircleUser className="h-4" />
          account
        </div>
      </NavLink>
      <NavLink href="/support">
        <div className="flex items-center justify-center">
          <Headset className="h-4" />
          support
        </div>
      </NavLink>
    </ul>
  );
}

function MobileDrawer({ isOpen, onClose }) {
  return (
    <div
      className={`fixed flex flex-col justify-center items-center z-10 top-0 right-0 h-full w-full bg-white text-black transition-transform duration-300 transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <button className="absolute right-7 top-4 p-3" onClick={onClose}>
        <X />
      </button>
      <ul className="flex flex-col justify-center items-center space-y-16">
        <NavLink href="/galleries">
          <div className="flex items-center justify-center text-3xl">
            <Images className="mr-4" />
            galleries
          </div>
        </NavLink>
        <NavLink href="/account">
          <div className="flex items-center justify-center text-3xl">
            <CircleUser className="mr-4" />
            account
          </div>
        </NavLink>

        <NavLink href="/support">
          <div className="flex items-center justify-center text-3xl">
            <Headset className="mr-4" />
            support
          </div>
        </NavLink>
      </ul>
    </div>
  );
}

function NavLink(props: { href; children; className?: string }) {
  return (
    <li
      className={cn(
        "transition duration-100 transform hover:scale-110 ",
        props.className
      )}
    >
      <Link href={props.href}>{props.children}</Link>
    </li>
  );
}
