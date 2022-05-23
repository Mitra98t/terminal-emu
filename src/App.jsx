import { createSignal } from "solid-js";

function App() {
  const [data, setData] = createSignal(0)
  return (
    <div class='w-full min-h-screen bg-red-300 flex flex-col items-center justify-center'>
      <div
        className="min-w-fit select-none min-h-fit flex flex-col items-center justify-center gap-4 p-4 cursor-pointer bg-transparent hover:bg-red-400 rounded-2xl"
        onClick={() => setData(data()+1)}
      >
        <p className="text-2xl font-bold">Ciao come va?</p>
        <p className="text-xl font-bold">{data()}</p>
      </div>
    </div>
  );
}

export default App;
