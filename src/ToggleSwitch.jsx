import React from "react";
import Switch from "react-switch";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ToggleSwitch({ toggleDarkMode, isDarkMode }) {
    return (
        <div className="flex items-center">
            <Switch
                onChange={toggleDarkMode}
                checked={isDarkMode}
                offColor="#888"
                onColor="#140145"
                offHandleColor="#fff"
                onHandleColor="#fff"
                uncheckedIcon={
                    <div className="flex items-center justify-center h-full">
                        <FaSun className="text-yellow-500" />
                    </div>
                }
                checkedIcon={
                    <div className="flex items-center justify-center h-full">
                        <FaMoon className="text-yellow-500" />
                    </div>
                }
                height={20}
                width={48}
                handleDiameter={24}
            />
        </div>
    );
}
