import { forwardRef, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { format } from "date-fns";

function App() {
  const [walletAddress, setWalletAddress] = useState(null);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date().setMonth(startDate.getMonth() + 1)
  );

  useEffect(() => {
    if (startDate > endDate) setStartDate(endDate);
  }, [endDate]);

  useEffect(() => {
    if (startDate > endDate) setEndDate(startDate);
  }, [startDate]);

  const TEST_DATA = [
    { id: 1, goal: "Learn Solidity", deadline: "01.02.2022" },
    { id: 2, goal: "Create my own NFT game", deadline: "01.03.2022" },
    { id: 3, goal: "Mint NFT collection", deadline: "01.04.2022" },
    {
      id: 4,
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
      <div className="mt-12">
        {TEST_DATA.map((goal) => (
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

  const renderAddGoalInput = () => (
    <div className="flex flex-col gap-4 mt-10">
      <label class="relative block">
        <span class="sr-only">Search</span>
        <input
          class=" placeholder:text-zinc-400 block bg-white w-full rounded-sm border-2 border-pink shadow-[0_4px_34px] shadow-pink z-20 py-2 pl-3 pr-3  focus:outline-none  focus:ring-pink focus:ring-1 sm:text-sm"
          placeholder="add your (learning) goal for 2022"
          type="text"
          name="search"
        />
      </label>
      <div className="flex gap-8">
        <div className="relative flex-1">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            nextMonthButtonLabel=">"
            previousMonthButtonLabel="<"
            popperClassName="react-datepicker-left"
            customInput={<ButtonInput />}
            renderCustomHeader={({
              date,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-lg text-zinc-700">
                  {format(date, "MMMM yyyy")}
                </span>

                <div className="space-x-2">
                  <button
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    type="button"
                    className={`${
                      prevMonthButtonDisabled && "cursor-not-allowed opacity-50"
                    } inline-flex p-1 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-pink`}
                  >
                    <ChevronLeftIcon className="w-5 h-5 text-zinc-600" />
                  </button>

                  <button
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    type="button"
                    className={`${
                      nextMonthButtonDisabled && "cursor-not-allowed opacity-50"
                    } inline-flex p-1 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-pink`}
                  >
                    <ChevronRightIcon className="w-5 h-5 text-zinc-600" />
                  </button>
                </div>
              </div>
            )}
          />
        </div>
        <button className="text-sm bg-pink px-6 py-2 text-white rounded-sm border-2 border-pink shadow-[0_4px_34px] shadow-pink z-20">
          Add!
        </button>
      </div>
    </div>
  );

  return (
    <div className="App h-screen flex">
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
          {walletAddress && renderFeed()}
        </div>
      </div>
    </div>
  );
}

export default App;

const ButtonInput = forwardRef(({ value, onClick }, ref) => (
  <button
    onClick={onClick}
    ref={ref}
    type="button"
    className="inline-flex justify-start w-full px-3 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-pink"
  >
    {format(new Date(value), "dd MMMM yyyy")}
  </button>
));
