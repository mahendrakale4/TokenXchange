// src/jupiterApi.js
import { Connection, Keypair, VersionedTransaction } from '@solana/web3.js';
import fetch from 'cross-fetch';
import bs58 from 'bs58';

// RPC Endpoint
// const connection = new Connection('https://api.devnet-beta.solana.com');
const connection = new Connection('https://api.devnet.solana.com');



export const getQuote = async (inputMint, outputMint, amount, slippageBps) => {
    const response = await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`);
    return response.json();
};

export const performSwap = async (quoteResponse, wallet) => {
    const response = await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quoteResponse,
            userPublicKey: wallet.publicKey.toString(),
            wrapAndUnwrapSol: true,
        })
    });
    return response.json();
};

export const signAndSendTransaction = async (transaction, wallet) => {
    const latestBlockHash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = latestBlockHash.blockhash;
    transaction.feePayer = wallet.publicKey;

    await transaction.sign([wallet]);

    const txid = await connection.sendRawTransaction(transaction.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
    });

    return txid;
};
