import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import CreateWallet from "./CreateWallet";
import FormComponent from "./Form";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function App() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const darkModePreference = localStorage.getItem("darkMode");
        if (darkModePreference === "enabled") {
            document.documentElement.classList.add("dark");
            setIsDarkMode(true);
        }
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        if (!isDarkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("darkMode", "enabled");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("darkMode", "disabled");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
            <FormComponent/>
            <ToastContainer />
            <CreateWallet/>
        </div>
    );
}

export default App;
