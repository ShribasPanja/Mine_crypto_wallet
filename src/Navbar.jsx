import ToggleSwitch from "./ToggleSwitch";

export default function Navbar({ toggleDarkMode, isDarkMode }) {
    return (
        <nav className="fixed z-50 w-full p-4 px-16 bg-gray-100 dark:bg-gray-800 shadow-md flex justify-between items-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Mine
            </div>
            <ToggleSwitch toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        </nav>
    );
}
