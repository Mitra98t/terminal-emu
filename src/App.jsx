import { createSignal, onMount, Show } from "solid-js";
import PastCommands from "./modules/PastCommands";
import Prompt from "./modules/Prompt";
import { validateCommand, execCommand, styleComm } from './utils/Command'

function App() {
  const [commandHistory, setCommandHistory] = createSignal([])
  const [oldCommands, setOldCommands] = createSignal([])
  const [historyPointer, setHistoryPointer] = createSignal(-1)
  let inputCommand

  function commandSubmit(event) {
    event.preventDefault();
    let command = {}
    command.command = inputCommand.value
    let commandToSet = { ...command }

    let updatedHistory = [...commandHistory(), command.command]
    setCommandHistory(updatedHistory)
    setHistoryPointer(historyPointer() + 1)

    switch (command.command) {
      case "history":
        commandToSet.history = [...commandHistory()]
        break;
      case "clear":
        setOldCommands([])
        inputCommand.value = ""
        return
      default:
        break;
    }

    let updateOldCom = [...oldCommands(), commandToSet]
    setOldCommands(updateOldCom)
    inputCommand.value = ""
  }

  onMount(() => {
    document.body.addEventListener("click", () => document.getElementById("commandInput").focus())
    addEvent(document, "keydown", (e) => {
      e = e || window.event;
      if (e.keyCode == 38 || e.keyCode == 40) historyNavigate(e.keyCode)
    })
  })

  function historyNavigate(keyCode) {
    switch (keyCode) {
      case 38:
        if (historyPointer() == -1) return
        inputCommand.value = commandHistory()[historyPointer()]
        if (historyPointer() > 0) {
          setHistoryPointer(historyPointer() - 1)
        }
        break;
      case 40:
        console.log("we")
        if (historyPointer() == -1) return
        if (historyPointer() == commandHistory().length - 1) {
          inputCommand.value = ""
          return
        }
        if (historyPointer() < commandHistory().length + 1) {

          console.log("ciao")
          setHistoryPointer(historyPointer() + 1)
        }
        inputCommand.value = commandHistory()[historyPointer()]
        break;

      default:
        break;
    }
  }

  function addEvent(element, eventName, callback) {
    if (element.addEventListener) {
      element.addEventListener(eventName, callback, false);
    } else if (element.attachEvent) {
      element.attachEvent("on" + eventName, callback);
    } else {
      element["on" + eventName] = callback;
    }
  }

  return (
    <div class='w-full min-h-screen max-h-screen overflow-y-auto bg-background p-4'>
      <div class='w-full h-full font-mono selection:bg-orange selection:text-darkBlue bg-background text-white border-2 border-orange rounded-2xl p-4'>
        <Show when={commandHistory().length > 0}>
          <PastCommands oldCommands={oldCommands} />
        </Show>
        <form onSubmit={commandSubmit}>
          <div className="w-full min-h-fit flex flex-row items-center justify-start gap-2">
            <Prompt />
            <input id="commandInput" type="text" ref={inputCommand} autoFocus={true} autocomplete="off" spellCheck="false" className="border-none outline-none bg-transparent font-bold" />
          </div>
          <input type="submit" value="" />
        </form>
      </div>
    </div>
  );
}

export default App;
