import { createEffect, createSignal, onMount, Show } from "solid-js";
import PastCommands from "./modules/PastCommands";
import Prompt from "./modules/Prompt";
import { commandList, hasProblem, validateCommandRepeat } from './utils/Command'
import { ubuntuLogo } from "./utils/Texts";

import './index.css';
import { stringify } from "postcss";
import Gamezone from "./Snake/Gamezone";

function App() {
  const [commandHistory, setCommandHistory] = createSignal([])
  const [oldCommands, setOldCommands] = createSignal([])
  const [possiblesTabCompl, setPossiblesTabCompl] = createSignal([])
  const [historyPointer, setHistoryPointer] = createSignal(-1)
  const [commandCount, setCommandCount] = createSignal(0)
  const [windowDim, setWindowDim] = createSignal([window.innerWidth, window.innerHeight])

  const [user, setUser] = createSignal({ "userName": "guest" })

  const [startupLogo, setStartupLogo] = createSignal(true)
  const [crt, setCrt] = createSignal(false)
  const [sudoRoutine, setSudoRoutine] = createSignal(false)
  const [wrongPass, setWrongPass] = createSignal(false)
  const [snakeActive, setSnakeActive] = createSignal(false)
  const [invertColor, setInvertColor] = createSignal(false)

  let inputCommand
  let passwordInput

  function scroll() {
    document.getElementById("inView").scrollIntoView({ behavior: "auto" })
  }

  function passwordSubmit(event) {
    event.preventDefault()
    if (passwordInput.value != "passwd") {
      setWrongPass(true)
      scroll()
      setTimeout(() => {
        setOldCommands([])
        setSudoRoutine(false)
        passwordInput.value = ""
        inputCommand.value = ""
        setUser({ "userName": "guest" })
        setWrongPass(false)
      }, 2000);
    }
    else {
      setOldCommands([])
      setCommandHistory([])
      setCommandCount(0)
      setUser({ "userName": "root" })
      passwordInput.value = ""
      inputCommand.value = ""
      setSudoRoutine(false)
    }
  }

  function commandSubmit(event) {
    event.preventDefault();
    if (isEmptyOrSpaces(inputCommand.value)) return
    let command = {}
    let words = inputCommand.value.split(" ")
    command.text = inputCommand.value
    command.command = words[0]
    words.shift()
    command.args = [...words]
    command.options = {}
    if (validateCommandRepeat(command)) {
      let position = command.command.slice(1)
      command = { ...commandHistory()[parseInt(position)] }
    }
    command.counter = commandCount()

    let updatedHistory = [...commandHistory(), command]
    setCommandHistory(updatedHistory)
    setHistoryPointer(updatedHistory.length - 1)

    if (command.command == "sudo") {
      if (hasProblem(command, user) == "")
        setSudoRoutine(true)
    }

    if (command.command == "history") command.history = [...commandHistory()]
    if (command.command == "exit") {
      command.wasSudo = user().userName == "root"
      if (hasProblem(command, user) == "") {
        setTimeout(() => {
          setUser({ "userName": "guest" })
          setOldCommands([])
          setCommandHistory([])
          setCommandCount(0)
          passwordInput.value = ""
          inputCommand.value = ""
        }, 1000);
      }
    }
    if (command.command == "crt") {
      command.wasCrt = crt()
      if (hasProblem(command, user) == "") {
        setCrt(() => !crt())
      }
    }
    if (command.command == "snake")
      if (hasProblem(command, user) == "")
        setSnakeActive(true)

    if (command.command == "invert")
      if (hasProblem(command, user) == "")
        setInvertColor(!invertColor())

    let updateOldCom = [...oldCommands(), command]
    setOldCommands(updateOldCom)

    if (command.command == "clear") setOldCommands([])


    setCommandCount(commandCount() + 1)
    inputCommand.value = ""
    setPossiblesTabCompl([])

    scroll()
  }

  onMount(() => {
    console.log(windowDim())
    document.body.addEventListener("click", () => {
      let commandInEl = document.getElementById("commandInput")
      let passwdInEl = document.getElementById("passwordInput")
      commandInEl && commandInEl.focus()
      passwdInEl && passwdInEl.focus()
    })
    addEvent(document, "keydown", (e) => {
      e = e || window.event;
      e.Handled = true
      if (e.keyCode == 9) tabComplete(e)
      if (e.keyCode == 38 || e.keyCode == 40) historyNavigate(e)
    })
  })

  createEffect(() => {
    if (sudoRoutine()) {
      let passwdInEl = document.getElementById("passwordInput")
      passwdInEl && passwdInEl.focus()
    }
    else {
      let commandInEl = document.getElementById("commandInput")
      commandInEl && commandInEl.focus()
    }
  })

  function tabComplete(e) {
    e.preventDefault()
    if (sudoRoutine()) return
    let possibles = []
    Object.keys(commandList).forEach(comm => {
      if (inputCommand.value == comm.slice(0, inputCommand.value.length))
        possibles.push(comm)
    });
    if (possibles.length == 1) {
      inputCommand.value = possibles[0]
      setPossiblesTabCompl([])
      return
    }
    setPossiblesTabCompl(possibles)
  }

  function historyNavigate(e) {
    e.preventDefault()
    if (snakeActive()) return
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
        if (historyPointer() == -1) return
        if (historyPointer() == commandHistory().length - 1) {
          inputCommand.value = ""
          return
        }
        if (historyPointer() < commandHistory().length + 1) {
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

  function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
  }

  return (
    <div class={(crt() ? "crt " : " ") + (invertColor() ? " invert " : "") + ' w-full h-screen overflow-y-auto bg-background p-4 text-lg'}>
      <div class='scrollbar-hide w-full h-full font-mono leading-5 overflow-y-scroll selection:bg-orange selection:text-black bg-background text-white border-2 border-orange rounded-2xl p-4'>
        <Show when={snakeActive()}><div id="SnakeDiv" className="absolute top-[15%] left-1/4 w-min min-h-fit flex flex-col gap-1 items-center justify-start" >
          <div className="h-8 w-[419px] z-2 border-2 border-orange bg-background rounded-lg">
            <svg className="w-auto h-full stroke-2 text-red" onClick={() => setSnakeActive(false)} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          <Gamezone />
        </div></Show>
        <Show when={startupLogo()}>
          <pre>{ubuntuLogo}</pre>
        </Show>
        <Show when={commandHistory().length > 0}>
          <PastCommands user={user} oldCommands={oldCommands} />
        </Show>
        {
          sudoRoutine() ?
            <div>
              <form onSubmit={passwordSubmit}>
                <div className="w-full min-h-fit flex flex-row items-center justify-start gap-2">
                  <p>password:</p>
                  <input
                    id="passwordInput"
                    type="password"
                    ref={passwordInput}
                    autoFocus={true}
                    autocomplete="off"
                    spellCheck="false"
                    className="w-full min-h-fit border-none outline-none bg-transparent font-bold"
                  />
                </div>
                <input type="submit" value="" />
              </form>
              <Show when={wrongPass()}><p>Wrong password, redirecting...</p></Show>
            </div>
            :
            <div>
              <form onSubmit={commandSubmit}>
                <div className="w-full min-h-fit flex flex-row items-center justify-start gap-2">
                  <Prompt user={user} />
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
              <Show when={possiblesTabCompl().length > 0}>
                <div className="flex flex-row gap-8 min-w-fit min-h-fit">
                  <For each={possiblesTabCompl()} fallback={<></>}>
                    {i => <p>{i}</p>}
                  </For>
                </div>
              </Show>
            </div>
        }
        <div id="inView"></div>
      </div >
    </div >
  );
}

export default App;
