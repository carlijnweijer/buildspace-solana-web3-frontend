import { useEffect, useState } from "react";
import DeadlinePicker from "./components/DeadlinePicker";
import { v4 as uuidv4 } from "uuid";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import { Buffer } from "buffer";
window.Buffer = Buffer;
import idl from "./idl.json";
import kp from "./keypair.json";
import { format } from "date-fns";

const { SystemProgram } = web3;

const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);

const programID = new PublicKey(idl.metadata.address);

const network = clusterApiUrl("devnet");

const opts = {
  preflightCommitment: "processed",
};

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [goal, setGoal] = useState("");
  const [date, setDate] = useState(new Date());

  const [goalsList, setGoalsList] = useState(null);

  const checkIfWalletIsConnected = async () => {
    const { solana } = window;

    try {
      if (solana) {
        if (solana.isPhantom) {
          const response = await solana.connect({ onlyIfTrusted: true });

          setWalletAddress(response.publicKey.toString());
        } else {
          alert("solana wallet not found!");
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
    if (goalsList === null) {
      return (
        <div>
          <p className="text-white">
            Click the button on the right to create your Account
          </p>
        </div>
      );
    } else {
      return (
        <div className="flex-1 pb-5">
          {goalsList.map((goal) => {
            return (
              <div
                key={goal.goalId}
                className="text-white p-8 mb-8 border border-lightblue max-w-fit rounded-sm card"
              >
                <h3 className="text-3xl">{goal.goalGoal}</h3>
                <p className="font-light text-zinc-50">
                  I will have achieved this on {goal.goalDeadline}
                </p>
              </div>
            );
          })}
        </div>
      );
    }
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };

    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  const getGoalList = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );

      setGoalsList(account.goalList);
    } catch (error) {
      setGoalsList(null);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      getGoalList();
    }
  }, [walletAddress]);

  const sendGoal = async () => {
    if (goal.length <= 0) {
      return;
    }

    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);

      await program.rpc.addGoal(
        uuidv4(),
        goal,
        format(date, "dd.MM.yyyy").toString(),
        {
          accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
          },
        }
      );
      console.log("Goal successfully sent to program", goal, date);

      await getGoalList();

      setGoal("");
      setDate(new Date());
    } catch (error) {
      console.log("error sending your goal:", error);
    }
  };

  const submitAddGoal = (e) => {
    e.preventDefault();
    sendGoal();
  };

  const renderAddGoalInput = () => {
    if (goalsList === null) {
      return (
        <div>
          <button
            className="text-sm bg-darkblue mt-4 px-6 py-2 text-white rounded-sm border-2 border-darkblue shadow-[0_4px_34px] shadow-darkblue z-20"
            onClick={createGoalAccount}
          >
            Do One-Time Initialization For Goal Program Account
          </button>
        </div>
      );
    } else {
      return (
        <form className="flex flex-col gap-4 mt-10" onSubmit={submitAddGoal}>
          <label className="relative block">
            <span className="sr-only">Search</span>
            <input
              className=" placeholder:text-zinc-400 block bg-white w-full rounded-sm border-2 border-pink shadow-[0_4px_34px] shadow-pink z-20 py-2 pl-3 pr-3  focus:outline-none  focus:ring-pink focus:ring-1 sm:text-sm"
              placeholder="add your web3 (learning) goal for 2022"
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
    }
  };

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  };

  const createGoalAccount = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      console.log("ping");
      await program.rpc.startStuffOff({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      });
      console.log(
        "created a new baseaccount with address: ",
        baseAccount.publicKey.toString()
      );
      await getGoalList();
    } catch (error) {
      console.log("error creating baseAccount account: ", error);
    }
  };

  return (
    <div className="App flex flex-col md:flex-row md:min-h-screen">
      <div className="min-h-[50vh] md:w-6/12 relative px-10 xl:px-16 xl:py-20">
        <div className="mb-11">
          <span className="text-4xl md:text-5xl xl:text-7xl">????</span>
        </div>
        <h1 className="text-4xl md:text-5xl xl:text-7xl leading-normal">
          <span className="text-4xl md:text-6xl xl:text-8xl font-bold text-pink">
            Share
          </span>
          <br /> your
          <span className="relative font-semibold circle-bg-web3"> Web3 </span>
          <br />
          <span className="text-pink">goals</span> for 2022
        </h1>

        {walletAddress && renderAddGoalInput()}

        <div className="relative w-40"></div>
        <div className="absolute -top-7 -left-36 bg-lightblue w-96 h-96 rounded-full blur-[300px] -z-10"></div>
        <div className="absolute right-0 bottom-0 bg-pink w-96 h-96 rounded-full blur-[300px] -z-10"></div>
        {!walletAddress && (
          <div className="md:absolute bottom-0 left-0 p-6 md:p-14 bg-zinc-900 text-white w-screen -ml-10 mt-12 md:max-w-xl z-10">
            <h2 className="text-2xl">Why should I learn Web3?</h2>
            <p className="font-light text-sm mt-[8px]">
              Learning Web3 is surely a crucial skill for developers to thrive
              and succeed in the coming years, given Web3???s ambition toward a
              genuinely decentralized internet.
            </p>
          </div>
        )}
      </div>
      <div className="md:w-6/12 relative bg-zinc-900 pb-8">
        <div className="absolute inset-y-1/3 -left-7 bg-lightblue w-96 h-96 rounded-full blur-[300px]"></div>
        <div className="absolute right-0 -top-7 bg-pink w-96 h-96 rounded-full blur-[300px]"></div>
        <div className="pl-10 xl:pl-20 pt-20 pb-10 pr-10 max-h-full relative z-50">
          <h2 className="text-white text-4xl md:text-5xl xl:text-6xl leading-normal mb-12">
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
