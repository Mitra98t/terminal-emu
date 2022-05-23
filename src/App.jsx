import { createEffect, createSignal, onMount, Show } from "solid-js";
import PastCommands from "./modules/PastCommands";
import Prompt from "./modules/Prompt";
import { validateCommandRepeat } from './utils/Command'
import { ubuntuLogo } from "./utils/Texts";

function App() {
  const [commandHistory, setCommandHistory] = createSignal([])
  const [oldCommands, setOldCommands] = createSignal([])
  const [historyPointer, setHistoryPointer] = createSignal(-1)
  const [startupLogo, setStartupLogo] = createSignal(true)
  const [commandCount, setCommandCount] = createSignal(0)
  let inputCommand

  function scroll() {
    document.getElementById("inView").scrollIntoView({ behavior: "auto" })
  }

  function commandSubmit(event) {
    event.preventDefault();
    let command = {}
    let words = inputCommand.value.split(" ")
    command.text = inputCommand.value
    command.command = words[0]
    words.shift()
    command.args = [...words]
    if (validateCommandRepeat(command)) {
      let position = command.command.slice(1)
      command = { ...commandHistory()[parseInt(position)] }
    }
    command.counter = commandCount()

    let updatedHistory = [...commandHistory(), command]
    setCommandHistory(updatedHistory)
    setHistoryPointer(updatedHistory.length - 1)

    if (command.command == "history") command.history = [...commandHistory()]

    let updateOldCom = [...oldCommands(), command]
    setOldCommands(updateOldCom)

    if (command.command == "clear") setOldCommands([])

    setCommandCount(commandCount() + 1)
    inputCommand.value = ""

    scroll()
  }

  onMount(() => {
    document.body.addEventListener("click", () => document.getElementById("commandInput").focus())
    addEvent(document, "keydown", (e) => {
      e = e || window.event;
      e.Handled = true
      if (e.keyCode == 38 || e.keyCode == 40) historyNavigate(e)
    })
  })

  function historyNavigate(e) {
    e.preventDefault()
    let keyCode = e.keyCode
    switch (keyCode) {
      case 38:
        if (historyPointer() == -1) return
        inputCommand.value = commandHistory()[historyPointer()].text
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
        inputCommand.value = commandHistory()[historyPointer()].text
        break;

      default:
        break;
    }

    scroll()
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
    <div class='w-full h-screen overflow-y-auto bg-background p-4 text-lg'>
      <div class='scrollbar-hide w-full h-full font-mono leading-5 overflow-y-scroll selection:bg-orange selection:text-black bg-background text-white border-2 border-orange rounded-2xl p-4'>
        <Show when={startupLogo()}>
          <pre>{ubuntuLogo}</pre>
        </Show>
        <Show when={commandHistory().length > 0}>
          <PastCommands oldCommands={oldCommands} />
        </Show>
        <form onSubmit={commandSubmit}>
          <div className="w-full min-h-fit flex flex-row items-center justify-start gap-2">
            <Prompt />
            <input
              id="commandInput"
              type="text"
              ref={inputCommand}
              autoFocus={true}
              autocomplete="off"
              spellCheck="false"
              className="w-full min-h-fit border-none outline-none bg-transparent font-bold"
            />
          </div>
          <input type="submit" value="" />
        </form>
        <div id="inView"></div>
      </div>
    </div >
  );
}

export default App;
