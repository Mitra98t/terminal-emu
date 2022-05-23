import { createSignal, onMount, Show } from "solid-js";
import PastCommands from "./modules/PastCommands";
import Prompt from "./modules/Prompt";
import { validateCommand, execCommand, styleComm } from './utils/Command'

function App() {
  const [commandHistory, setCommandHistory] = createSignal([])
  const [oldCommands, setOldCommands] = createSignal([])
  let inputCommand

  function commandSubmit(event) {
    event.preventDefault();
    let command = inputCommand.value

    let updatedHistory = [...commandHistory(), command]
    setCommandHistory(updatedHistory)

    let updateOldCom = [...oldCommands(), command]
    setOldCommands(updateOldCom)
    inputCommand.value = ""
  }

  onMount(() => {
    document.body.addEventListener("click", () => document.getElementById("commandInput").focus())
  })

  return (
    <div class='w-full min-h-screen bg-background p-4'>
      <div class='w-full h-full font-mono selection:bg-orange selection:text-darkBlue bg-background text-white border-2 border-orange rounded-2xl p-4'>
        <Show when={commandHistory().length > 0}>
          <PastCommands oldCommands={oldCommands} />
        </Show>
        <form onSubmit={commandSubmit}>
          <div className="w-full min-h-fit flex flex-row items-center justify-start gap-2">
            <Prompt />
            <input id="commandInput" type="text" ref={inputCommand} autoFocus={true} className="border-none outline-none bg-transparent " />
          </div>
          <input type="submit" value="" />
        </form>
      </div>
    </div>
  );
}

export default App;
