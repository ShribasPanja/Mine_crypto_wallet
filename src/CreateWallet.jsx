import { useState, useEffect } from 'react';
import { mnemonicToSeed } from 'bip39';
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { Wallet, HDNodeWallet } from "ethers";
import { notify } from './Notification';
import SolanaBalance from './GetSolanaBalance';
import EthereumBalance from './GetEthereumBalance';
import Transaction from './Transaction';
import solanaLogo from './assets/solanaLogo.png';
import ethereumLogo from './assets/ethLogo.png';
import send from './assets/send.svg';
import receive from './assets/receive.svg';
import key from './assets/key.svg';

export default function CreateWallet() {
    const [solanaKeys, setSolanaKeys] = useState(() => {
        const savedKeys = localStorage.getItem("solanaKeys");
        return savedKeys ? JSON.parse(savedKeys) : [];
    });
    const [ethereumKeys, setEthereumKeys] = useState(() => {
        const savedKeys = localStorage.getItem("ethereumKeys");
        return savedKeys ? JSON.parse(savedKeys) : [];
    });
    const [solanaPrivateKeys, setSolanaPrivateKeys] = useState(() => {
        const savedKeys = localStorage.getItem("solanaPrivateKeys");
        return savedKeys ? JSON.parse(savedKeys) : [];
    });
    const [ethereumPrivateKeys, setEthereumPrivateKeys] = useState(() => {
        const savedKeys = localStorage.getItem("ethereumPrivateKeys");
        return savedKeys ? JSON.parse(savedKeys) : [];
    });
    const [currentIndex, setCurrentIndex] = useState(() => {
        const savedSolanaKeys = localStorage.getItem("solanaKeys");
        const savedEthereumKeys = localStorage.getItem("ethereumKeys");
        return Math.max(
            savedSolanaKeys ? JSON.parse(savedSolanaKeys).length : 0,
            savedEthereumKeys ? JSON.parse(savedEthereumKeys).length : 0
        );
    });
    const [seed, setSeed] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isModalOpen]);

    useEffect(() => {
        const fetchSeed = async () => {
            let mnemonicWords = localStorage.getItem("mnemonicWords");
            while (!mnemonicWords) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                mnemonicWords = localStorage.getItem("mnemonicWords");
            }
            try {
                const seedBuffer = await mnemonicToSeed(mnemonicWords);
                console.log("Seed generated:", seedBuffer);
                setSeed(seedBuffer);
            } catch (error) {
                console.error("Error generating seed:", error);
            }
        };
        fetchSeed();
    }, []);

    useEffect(() => {
        localStorage.setItem("solanaKeys", JSON.stringify(solanaKeys));
        localStorage.setItem("ethereumKeys", JSON.stringify(ethereumKeys));
        localStorage.setItem("solanaPrivateKeys", JSON.stringify(solanaPrivateKeys));
        localStorage.setItem("ethereumPrivateKeys", JSON.stringify(ethereumPrivateKeys));
        console.log("Solana Keys:", localStorage.getItem("solanaKeys"));
        console.log("Ethereum Keys:", localStorage.getItem("ethereumKeys"));
        console.log("Solana Private Keys:", localStorage.getItem("solanaPrivateKeys"));
        console.log("Ethereum Private Keys:", localStorage.getItem("ethereumPrivateKeys"));
    }, [solanaKeys, ethereumKeys, solanaPrivateKeys, ethereumPrivateKeys]);

    const generateSolWallet = async () => {
        if (!seed) return;
        try {
            const path = `m/44'/501'/${currentIndex}'/0'`;
            const derivedSeed = derivePath(path, seed.toString("hex")).key;
            const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
            const keypair = Keypair.fromSecretKey(secret);
            setCurrentIndex(currentIndex + 1);
            setSolanaKeys(prevKeys => [...prevKeys, keypair.publicKey.toBase58()]);
            setSolanaPrivateKeys(prevKeys => [...prevKeys, Buffer.from(secret).toString('hex')]);
            console.log("Solana Public Key:", keypair.publicKey.toBase58());
            notify("solana wallet generated!");
        } catch (error) {
            console.error("Error generating Solana wallet:", error);
        }
    };

    const generateEthWallet = async () => {
        if (!seed) return;
        try {
            const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
            const hdNode = HDNodeWallet.fromSeed(seed);
            const child = hdNode.derivePath(derivationPath);
            const wallet = new Wallet(child.privateKey);
            setCurrentIndex(currentIndex + 1);
            setEthereumKeys(prevKeys => [...prevKeys, wallet.address]);
            setEthereumPrivateKeys(prevKeys => [...prevKeys, wallet.privateKey]);
            console.log("Ethereum Address:", wallet.address);
            notify("ethereum wallet generated!");
        } catch (error) {
            console.error("Error generating Ethereum wallet:", error);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard:', text);
            notify("public key copied to clipboard!");
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    };
    
    const solPrivateKeyCopy= (index) => {
        const privateKey = solanaPrivateKeys[index-1];
        navigator.clipboard.writeText(privateKey).then(() => {
            console.log('Copied to clipboard:', privateKey);
            notify("private key copied to clipboard!");
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    };

    const ethPrivateKeyCopy= (index) => {
        const privateKey = ethereumPrivateKeys[index-1];
        navigator.clipboard.writeText(privateKey).then(() => {
            console.log('Copied to clipboard:', privateKey);
            notify("private key copied to clipboard!");
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    };

    return (
        <div>
        <div className="flex items-center justify-between px-6 py-4 bg-[#F5EDED] dark:bg-gray-800 shadow-xl mx-40 mt-10 rounded-lg">
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Create Wallet
            </div>
            <div className="flex space-x-4">
                <button onClick={generateSolWallet} className="flex items-center px-8 text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600">
                    <img src={solanaLogo} alt="Solana Logo" className="w-5 h-5 mr-2" />
                    Solana
                </button>
                <button onClick={generateEthWallet} className="flex items-center text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600">
                    <img src={ethereumLogo} alt="Ethereum Logo" className="w-5 h-5 mr-2" />
                    Ethereum
                </button>
            </div>
        </div>
        <div className="grid grid-cols-4 gap-10 items-center justify-between px-6 py-10 mx-40 mt-10">
            {solanaKeys.map((prop, index) => (
                <div key={index} className="max-w-sm p-6 bg-[#F5EDED] border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
                    <img src={solanaLogo} alt="solana" className="w-7 h-7 mb-3" />
                    <h5 className="mb-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white"><SolanaBalance walletAddress={prop}/></h5>
                    <h5 className="mb-3 font-semibold text-2xl text-gray-500 dark:text-gray-400">Wallet {index + 1}</h5>
                    <div className='flex items-center justify-center'>
                        <button type="button" onClick={openModal} className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-full text-sm p-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700">
                            <img src={send} className="w-7 h-7" alt="send" />
                        </button>
                        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-full text-sm p-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700">
                            <img src={receive} className="w-7 h-7" alt="receive" onClick={() => copyToClipboard(prop)} />
                        </button>
                        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-full text-sm p-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700">
                            <img src={key} className="w-7 h-7" alt="key" onClick={() => solPrivateKeyCopy(index)} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
        <div className="grid grid-cols-4 gap-10 items-center justify-between px-6 py-10 mx-40 mt-10">
            {ethereumKeys.map((prop, index) => (
                <div key={index} className="max-w-sm p-6 bg-[#F5EDED] border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
                    <img src={ethereumLogo} alt="solana" className="w-7 h-7 mb-3" />
                    <h5 className="mb-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white"><EthereumBalance walletAddress={prop}/></h5>
                    <h5 className="mb-3 font-semibold text-2xl text-gray-500 dark:text-gray-400">Wallet {index + 1}</h5>
                    <div className='flex items-center justify-center'>
                        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-full text-sm p-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700">
                            <img src={send} className="w-7 h-7" alt="send" />
                        </button>
                        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-full text-sm p-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700">
                            <img src={receive} className="w-7 h-7" alt="receive" onClick={() => copyToClipboard(prop)} />
                        </button>
                        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-full text-sm p-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700">
                            <img src={key} className="w-7 h-7" alt="key" onClick={() => ethPrivateKeyCopy(index)} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
        {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-80">
            <h2 className="text-xl mb-4 text-gray-900 dark:text-gray-100">Send Solana</h2>
            <form>
              <input type="text" placeholder="Enter Address" className="w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:text-gray-100" />
              <input type="text" placeholder="Enter Amount" className="w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:text-gray-100" />
              <div className="flex justify-between">
                <button type="button" onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded">
                  Back
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </div>
    );
}