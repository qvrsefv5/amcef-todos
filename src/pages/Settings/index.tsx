import React from "react";
import { Select } from "@headlessui/react";
import { useThemeContext } from "@/contexts/ThemeContext";

function Settings() {
  const { setAppTheme } = useThemeContext();
  return (
    <div className="h-dvh">
      <h1>Settings</h1>
      <div className="fixed top-24 w-52 text-right">
        <label className="text-text">theme:</label>
        <Select
          className="text-text"
          name="status"
          aria-label="Project status"
          onChange={(e) => setAppTheme(e.target.value)}
        >
          <option value="light">light</option>
          <option value="dark">dark</option>
        </Select>
      </div>
    </div>
  );
}

export default Settings;
