import { useEffect, useState } from "react";

function App() {
  const [walletAddress, setWalletAddress] = useState(null);

  //actions
  const checkIfWalletIsConnected = async () => {
    const { solana } = window;

    try {
      if (solana) {
        if (solana.isPhantom) {
          console.log("phantom wallet found!");

          //the solana object provides a function that will allow us to connect directly with the users wallet
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            "connected with public key:",
            response.publicKey.toString()
          );

          setWalletAddress(response.publicKey.toString());
        } else {
          alert("solana not found!");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  //define a method to connect the wallet
  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("connected with public key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  //render this if a user hasn't connected their wallet to our app yet
  const renderWhenNotConnected = () => {
    return (
      <div>
        <p className="text-white font-light mb-7">
          To use this app you a need Solana wallet. Our app works with{" "}
          <span className="text-mediumblue font-normal">Phantom</span>, one of
          the top wallet extensions for Solana. <br />
          <span className="text-xs">
            (Phantom is actually backed by Solana so you know it's legit)
          </span>
        </p>
        <button
          onClick={connectWallet}
          className="text-lg bg-lightblue px-6 py-2 text-white rounded-sm border-2 border-lightblue shadow-[0_4px_34px] shadow-lightblue z-20"
        >
          Connect your wallet
        </button>
      </div>
    );
  };

  const renderWhenWalletConnected = () => {
    return (
      <div className="mt-12">
        <div className="text-white p-8 border border-lightblue max-w-fit rounded-sm card">
          <h3 className="text-3xl">Learn Solidity</h3>
          <p className="font-light text-zinc-50">
            I will have achieved this on 01.02.2022
          </p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };

    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="App h-screen flex">
      <div className="w-6/12 relative overflow-hidden px-16 py-20">
        <div className="mb-11">
          <span className="text-7xl">🦄</span>
        </div>
        <h1 className="text-7xl leading-normal">
          <span className="text-8xl font-bold text-purple">Share</span>
          <br /> your{" "}
          <span className="relative font-semibold circle-bg-web3">
            Web3
          </span>{" "}
          <br />
          <span className="text-pink">goals</span> for 2022
        </h1>

        <div className="absolute -top-7 -left-36 bg-lightblue w-96 h-96 rounded-full blur-[300px] -z-10"></div>
        <div className="absolute right-0 -bottom-7 bg-pink w-96 h-96 rounded-full blur-[300px] -z-10"></div>
        <div className="absolute bottom-0 left-0 p-14 bg-zinc-900 text-white max-w-xl z-10">
          <h2 className="text-2xl">Why should I learn Web3?</h2>
          <p className="font-light text-sm mt-[8px]">
            Learning Web3 is surely a crucial skill for developers to thrive and
            succeed in the coming years, given Web3’s ambition toward a
            genuinely decentralized internet.
          </p>
        </div>
      </div>
      <div className="w-6/12 relative bg-zinc-900">
        <div className="absolute inset-y-1/3 -left-7 bg-lightblue w-96 h-96 rounded-full blur-[300px]"></div>
        <div className="absolute right-0 -top-7 bg-pink w-96 h-96 rounded-full blur-[300px]"></div>
        <div className="p-20 relative z-50">
          <h2 className="text-white text-6xl leading-normal mb-12">
            The <span className="font-semibold text-pink">goals</span>
            <br />
            of the community
          </h2>
          {!walletAddress && renderWhenNotConnected()}
          {walletAddress && renderWhenWalletConnected()}
        </div>
      </div>
    </div>
  );
}

export default App;
