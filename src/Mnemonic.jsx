import { useState, useEffect, useCallback } from "react";
import { generateMnemonic } from "bip39";
import { notify } from "./Notification";

export default function Mnemonic() {
    const [mnemonicWords, setMnemonicWords] = useState("");

    const generateRandom = useCallback(async () => {
        try {
            const words = generateMnemonic();
            setMnemonicWords(words);
            localStorage.setItem("mnemonicWords", words);
        } catch (error) {
            console.error("Failed to generate mnemonic: ", error);
        }
    }, []);

    useEffect(() => {
        const savedMnemonic = localStorage.getItem("mnemonicWords");
        if (savedMnemonic) {
            setMnemonicWords(savedMnemonic);
        } else {
            generateRandom();
        }
    }, [generateRandom]);

    const Mnemonic = mnemonicWords.split(" ");
    console.log(Mnemonic);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(mnemonicWords).then(() => {
            notify("Mnemonic words copied to clipboard!");
        }).catch(err => {
            console.error("Failed to copy text: ", err);
        });
    };

    return (
        <div className="pt-14">
            <div className="flex items-center justify-center text-2xl font-bold py-8">
                <h1>Your Secret Phrase</h1>
            </div>
            <div className="grid grid-cols-4 gap-10 w-2/5 mx-auto bg-[#F5EDED] dark:bg-gray-800 p-8 rounded-lg shadow-lg blur-md hover:blur-none" onClick={copyToClipboard}>
                {Mnemonic.map((prop, index) => (
                    <div className="flex items-center justify-center bg-[#E2DAD6] dark:bg-gray-700 rounded-lg p-4" key={index}>
                        {prop}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function getPhrase() {
    const mnemonicWords = localStorage.getItem("mnemonicWords") || "";
    return mnemonicWords;
}
