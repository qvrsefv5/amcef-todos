import React from "react";
import { Link, NavLink, Outlet } from "react-router";

function Layout() {
  return (
    <>
      <header className="flex justify-around ">
        <Link to="/">ToDoo</Link>
        <nav>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-text p-4" : "text-primary p-4"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? "text-text p-4" : "text-primary p-4"
            }
          >
            Settings
          </NavLink>
        </nav>
      </header>
      <section>
        <Outlet />
      </section>
    </>
  );
}

export default Layout;
