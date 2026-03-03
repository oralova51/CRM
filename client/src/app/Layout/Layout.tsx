import type { Dispatch, SetStateAction } from "react";
import { Outlet } from "react-router";

import "./Layout.css";
import Header from "@/widgets/Header/Header";



export default function Layout() {
  return (
    <>
      <Header  />
      <Outlet />
      {/* <footer>Footer</footer>/ */}
    </>
  );
}
