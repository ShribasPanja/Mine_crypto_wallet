import { useState, useEffect } from "react";
import Mnemonic from "./Mnemonic";
import { getPhrase } from "./Mnemonic";

export default function App() {
    const [showMnemonic, setShowMnemonic] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("mnemonicWords")) {
            setShowMnemonic(true);
        }
    }, []);

    const generateMnemonic = () => {
        setShowMnemonic(true);
    };

    return (
        <div>
            {showMnemonic ? (
                <Mnemonic />
            ) : (
                <FormComponent onGenerate={generateMnemonic} />
            )}
        </div>
    );
}

function FormComponent({ onGenerate }) {
    const [mnemonic, setMnemonic] = useState("");

    const handleChange = (e) => {
        setMnemonic(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem("mnemonicWords", mnemonic);
        onGenerate();
    };

    return (
        <div>
            <div className="flex items-center justify-center text-2xl font-bold py-8">
                <h1>Enter Your Secret Phrase</h1>
            </div>
            <div className="w-2/5 mx-auto bg-[#F5EDED] dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <form className="mb-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter Mnemonic"
                        value={mnemonic}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-700 dark:text-white mb-4"
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
                        Enter
                    </button>
                </form>
                <button onClick={onGenerate} className="w-full bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-800">
                    Generate Phrase
                </button>
            </div>
        </div>
    );
}
