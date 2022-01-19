import { useEffect, useState } from "react";
import DeadlinePicker from "./components/DeadlinePicker";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [goal, setGoal] = useState("");
  const [date, setDate] = useState(new Date());

  const [goalsList, setGoalsList] = useState([]);

  const TEST_DATA = [
    { id: 1, goal: "Learn Solidity", deadline: "01.02.2022" },
    { id: 2, goal: "Learn Solidity", deadline: "01.02.2022" },
    { id: 4, goal: "Create my own NFT game", deadline: "01.03.2022" },
    { id: 3, goal: "Mint NFT collection", deadline: "01.04.2022" },
    {
      id: 5,
      goal: "Build my own DAO with just JavaScript",
      deadline: "01.05.2022",
    },
    { id: 6, goal: "Create my own NFT game", deadline: "01.03.2022" },
    { id: 6, goal: "Mint NFT collection", deadline: "01.04.2022" },
    {
      id: 8,
      goal: "Build my own DAO with just JavaScript",
      deadline: "01.05.2022",
    },
  ];

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
          <span className="text-lightblue font-normal">Phantom</span>, one of
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

  const renderFeed = () => {
    return (
      <div className="flex-1 pb-5 overflow-y-auto">
        {goalsList.map((goal) => (
          <div
            key={goal.id}
            className="text-white p-8 mb-8 border border-lightblue max-w-fit rounded-sm card"
          >
            <h3 className="text-3xl">{goal.goal}</h3>
            <p className="font-light text-zinc-50">
              I will have achieved this on {goal.deadline}
            </p>
          </div>
        ))}
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

  useEffect(() => {
    if (walletAddress) {
      console.log("fetching everyones goals...");

      //Call Solana program here

      //Set state
      setGoalsList(TEST_DATA);
    }
  }, [walletAddress]);

  const sendGoal = async () => {
    if (goal.length > 0 && date) {
      console.log("goal: ", goal);
      console.log("deadline: ", date);
      setGoalsList([
        ...goalsList,
        { id: uuidv4(), goal: goal, deadline: format(date, "dd.MM.yyyy") },
      ]);
      setGoal("");
      setDate(new Date());
    } else {
      console.log("Empty goal. Try again.");
    }
  };

  const submitAddGoal = (e) => {
    e.preventDefault();
    sendGoal();
    console.log("goalslist is now: ", goalsList);
  };

  const renderAddGoalInput = () => (
    <form className="flex flex-col gap-4 mt-10" onSubmit={submitAddGoal}>
      <label className="relative block">
        <span className="sr-only">Search</span>
        <input
          className=" placeholder:text-zinc-400 block bg-white w-full rounded-sm border-2 border-pink shadow-[0_4px_34px] shadow-pink z-20 py-2 pl-3 pr-3  focus:outline-none  focus:ring-pink focus:ring-1 sm:text-sm"
          placeholder="add your (learning) goal for 2022"
          type="text"
          name="search"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
      </label>
      <div className="flex gap-8">
        <DeadlinePicker date={date} setDate={setDate} />
        <button className="text-sm bg-pink px-6 py-2 text-white rounded-sm border-2 border-pink shadow-[0_4px_34px] shadow-pink z-20">
          Add!
        </button>
      </div>
    </form>
  );

  return (
    <div className="App h-screen flex overflow-hidden">
      <div className="w-6/12 relative overflow-hidden px-16 py-20">
        <div className="mb-11">
          <span className="text-7xl">🦄</span>
        </div>
        <h1 className="text-7xl leading-normal">
          <span className="text-8xl font-bold text-pink">Share</span>
          <br /> your{" "}
          <span className="relative font-semibold circle-bg-web3">
            Web3
          </span>{" "}
          <br />
          <span className="text-pink">goals</span> for 2022
        </h1>

        {walletAddress && renderAddGoalInput()}

        <div className="relative w-40"></div>
        <div className="absolute -top-7 -left-36 bg-lightblue w-96 h-96 rounded-full blur-[300px] -z-10"></div>
        <div className="absolute right-0 -bottom-7 bg-pink w-96 h-96 rounded-full blur-[300px] -z-10"></div>
        {!walletAddress && (
          <div className="absolute bottom-0 left-0 p-14 bg-zinc-900 text-white max-w-xl z-10">
            <h2 className="text-2xl">Why should I learn Web3?</h2>
            <p className="font-light text-sm mt-[8px]">
              Learning Web3 is surely a crucial skill for developers to thrive
              and succeed in the coming years, given Web3’s ambition toward a
              genuinely decentralized internet.
            </p>
          </div>
        )}
      </div>
      <div className="w-6/12 relative bg-zinc-900 pb-8">
        <div className="absolute inset-y-1/3 -left-7 bg-lightblue w-96 h-96 rounded-full blur-[300px]"></div>
        <div className="absolute right-0 -top-7 bg-pink w-96 h-96 rounded-full blur-[300px]"></div>
        <div className="pl-20 pt-20 pb-10 pr-10 max-h-full relative z-50">
          <h2 className="text-white text-6xl leading-normal mb-12">
            The <span className="font-semibold text-pink">goals</span>
            <br />
            of the community
          </h2>
          {!walletAddress && renderWhenNotConnected()}

          <div className="relative flex flex-col max-h-[70vh]">
            {walletAddress && renderFeed()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
