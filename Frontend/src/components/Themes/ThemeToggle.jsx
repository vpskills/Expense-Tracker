import { useEffect, useState } from "react";
import { useGlobalContext } from "../GlobalContext";

export default function ThemeToggle() {
    const { darkMode, setDarkMode } = useGlobalContext();

    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 px-4 rounded-lg bg-blue-200 dark:bg-neutral-800 text-gray-800 outline-none dark:text-gray-100 transition-transform duration-200 active:scale-95"
        >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
    );
}
