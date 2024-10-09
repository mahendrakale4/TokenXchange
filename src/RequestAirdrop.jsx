import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";


function RequestAirdrop() {
    const { connection } = useConnection();
    const wallet = useWallet();

    // console.log(wallet.publicKey);
    console.log(connection.requestAirdrop);

    async function requestfunction() {
        if (!wallet.publicKey) { alert("Wallet not connected"); return; }

        let amount = document.getElementById('amt').value;

        console.log("Airdropped " + amount + " SOL to " + wallet.publicKey.toBase58());
        try {
            // await connection.requestAirdrop(wallet.publicKey, amount * LAMPORTS_PER_SOL);
            await connection.requestAirdrop(wallet.publicKey, amount * LAMPORTS_PER_SOL);
            alert("Airdropped " + amount + " SOL to " + wallet.publicKey.toBase58());
        } catch (error) {
            console.error("Airdrop failed:", error);
            alert("Airdrop failed");
        }
    }

    return (
        <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }} >

            <input id='amt' type='text' placeholder="Enter your public key" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginRight: '10px' }} />

            <button onClick={requestfunction} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>Send SoL</button>

        </div>
    );
}

export default RequestAirdrop;
