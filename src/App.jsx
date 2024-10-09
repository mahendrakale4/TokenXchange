// import React, { useState } from 'react';
// import { Connection, Keypair } from '@solana/web3.js';
// import { getQuote, performSwap, signAndSendTransaction } from './jupiterApi';
// import bs58 from 'bs58';
// import 'dotenv/config'
// import { Buffer } from 'buffer';

// // Polyfill for Buffer
// window.Buffer = Buffer;

// function App() {
//   const [wallet, setWallet] = useState(null);
//   const [quoteResponse, setQuoteResponse] = useState(null);
//   const [transactionId, setTransactionId] = useState('');


//   console.log("Private Key:", process.env.REACT_APP_PRIVATE_KEY);

//   const connectWallet = () => {
//     try {
//       setError('');
//       const privateKeyString = process.env.REACT_APP_PRIVATE_KEY;

//       if (!privateKeyString) {
//         throw new Error('Private key not found in environment variables');
//       }

//       let secretKey;
//       try {
//         // Try parsing as JSON string first
//         const parsedKey = JSON.parse(privateKeyString);
//         secretKey = new Uint8Array(parsedKey);
//       } catch {
//         // If JSON parsing fails, assume it's already an array string and evaluate it
//         try {
//           secretKey = new Uint8Array(eval(privateKeyString));
//         } catch {
//           throw new Error('Invalid private key format');
//         }
//       }
//       const keypair = Keypair.fromSecretKey(secretKey);
//       setWallet(keypair);
//       console.log("Wallet connected:", keypair.publicKey.toString());
//     } catch (error) {
//       setError(`Failed to connect wallet: ${error.message}`);
//       console.error("Failed to connect wallet:", error);
//     }
//   };



//   const handleSwap = async () => {
//     if (!wallet) return;

//     const inputMint = 'So11111111111111111111111111111111111111112'; // SOL
//     const outputMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // USDC
//     const amount = '100000000'; // 0.1 SOL
//     const slippageBps = 50;

//     const quote = await getQuote(inputMint, outputMint, amount, slippageBps);
//     setQuoteResponse(quote);

//     const swapTransaction = await performSwap(quote, wallet);
//     const tx = VersionedTransaction.deserialize(Buffer.from(swapTransaction.swapTransaction, 'base64'));

//     const txid = await signAndSendTransaction(tx, wallet);
//     setTransactionId(txid);
//   };

//   return (
//     <div>
//       <h1>Jupiter Swap Example</h1>
//       <button onClick={connectWallet}>Connect Wallet</button>
//       <button onClick={handleSwap} disabled={!wallet}>Swap SOL to USDC</button>
//       {transactionId && <p>Transaction ID: {transactionId}</p>}
//     </div>
//   );
// }

// export default App;


import React, { useState } from 'react';
import { Connection, Keypair, VersionedTransaction } from '@solana/web3.js';
import { getQuote, performSwap, signAndSendTransaction } from './jupiterApi';
import { Buffer } from 'buffer';

// Polyfill for Buffer
window.Buffer = Buffer;

// Constants
const INPUT_MINT = 'So11111111111111111111111111111111111111112'; // SOL
const OUTPUT_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // USDC
const AMOUNT = '100000000'; // 0.1 SOL
const SLIPPAGE_BPS = 50;

function App() {
  const [wallet, setWallet] = useState(null);
  const [quoteResponse, setQuoteResponse] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const PRIVATE_KEY = [82, 57, 249, 132, 36, 6, 230, 214, 116, 150, 65, 189, 67, 141, 26, 123, 215, 248, 100, 36, 216, 238, 216, 182, 160, 17, 190, 233, 223, 81, 141, 28, 45, 3, 140, 213, 26, 2, 97, 196, 245, 245, 28, 235, 113, 231, 59, 156, 17, 196, 162, 38, 58, 132, 228, 185, 173, 116, 17, 169, 37, 172, 197, 132];
  const connectWallet = () => {
    try {
      setError('');
      const secretKey = new Uint8Array(PRIVATE_KEY);
      const keypair = Keypair.fromSecretKey(secretKey);
      setWallet(keypair);
      console.log("Wallet connected:", keypair.publicKey.toString());
    } catch (error) {
      setError(`Failed to connect wallet: ${error.message}`);
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleSwap = async () => {
    if (!wallet) {
      setError('Please connect wallet first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const quote = await getQuote(INPUT_MINT, OUTPUT_MINT, AMOUNT, SLIPPAGE_BPS);
      setQuoteResponse(quote);

      const swapTransaction = await performSwap(quote, wallet);
      const tx = VersionedTransaction.deserialize(Buffer.from(swapTransaction.swapTransaction, 'base64'));

      const txid = await signAndSendTransaction(tx, wallet);
      setTransactionId(txid);
    } catch (error) {
      setError(`Swap failed: ${error.message}`);
      console.error("Swap failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Jupiter Swap Example</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={connectWallet}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={isLoading}
        >
          {wallet ? 'Wallet Connected' : 'Connect Wallet'}
        </button>

        <button
          onClick={handleSwap}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
          disabled={!wallet || isLoading}
        >
          {isLoading ? 'Processing...' : 'Swap SOL to USDC'}
        </button>

        {quoteResponse && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h2 className="font-semibold">Quote Details:</h2>
            <pre className="mt-2 text-sm overflow-x-auto">
              {JSON.stringify(quoteResponse, null, 2)}
            </pre>
          </div>
        )}

        {transactionId && (
          <div className="mt-4">
            <h2 className="font-semibold">Transaction ID:</h2>
            <a
              href={`https://solscan.io/tx/${transactionId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 break-all"
            >
              {transactionId}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;