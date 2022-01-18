function App() {
  return (
    <div className="App h-screen flex">
      <div className="w-6/12 relative overflow-hidden px-16 py-20">
        <div className="mb-11">
          <span className="text-7xl">🦄</span>
        </div>
        <h1 className="text-7xl leading-normal">
          <span className="text-8xl font-bold text-purple">Share</span>
          <br /> your <span className="font-semibold">Web3</span> <br />
          <span className="text-pink">goals</span> for 2022
        </h1>
        <div className="absolute -top-7 -left-36 bg-lightblue w-96 h-96 rounded-full blur-[300px] -z-10"></div>
        <div className="absolute right-0 -bottom-7 bg-pink w-96 h-96 rounded-full blur-[300px] -z-10"></div>

        <div className="absolute bottom-0 left-0 p-14 bg-zinc-900 text-white max-w-xl">
          <h2 className="text-2xl">Why should I learn Web3?</h2>
          <p className="font-light text-sm mt-[8px]">
            Learning Web3 is surely a crucial skill for developers to thrive and
            succeed in the coming years, given Web3’s ambition toward a
            genuinely decentralized internet.
          </p>
        </div>
      </div>
      <div className="w-6/12 relative bg-zinc-900" />
    </div>
  );
}

export default App;
