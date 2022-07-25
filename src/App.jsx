import { createEffect, createSignal, onMount, Show } from "solid-js";
import PastCommands from "./modules/PastCommands";
import Prompt from "./modules/Prompt";
import { commandList, hasProblem, validateCommandRepeat } from './utils/Command'
import { ubuntuLogo } from "./utils/Texts";

import './index.css';
import { stringify } from "postcss";
import Gamezone from "./Snake/Gamezone";
import { finalsObj } from "./utils/Finals";
import { filesArr } from "./utils/Files";

const rootPassword = "rooth"

function App() {
  const [commandHistory, setCommandHistory] = createSignal([])
  const [oldCommands, setOldCommands] = createSignal([])
  const [possiblesTabCompl, setPossiblesTabCompl] = createSignal([])
  const [historyPointer, setHistoryPointer] = createSignal(-1)
  const [commandCount, setCommandCount] = createSignal(0)
  const [windowDim, setWindowDim] = createSignal([window.innerWidth, window.innerHeight])
  const [finals, setFinals] = createSignal(localStorage.getItem("finals") ? JSON.parse(localStorage.getItem("finals")) : finalsObj)
  const [firstSudoComm, setFirstSudoComm] = createSignal(null)

  const [user, setUser] = createSignal({ "userName": "guest" })

  const [startupLogo, setStartupLogo] = createSignal(true)
  const [crt, setCrt] = createSignal(false)
  const [sudoRoutine, setSudoRoutine] = createSignal(false)
  const [wrongPass, setWrongPass] = createSignal(false)
  const [snakeActive, setSnakeActive] = createSignal(false)
  const [snakePointCounter, setSnakePointCounter] = createSignal(1)
  const [invertColor, setInvertColor] = createSignal(false)
  const [myopia, setMyopia] = createSignal(false)

  let inputCommand
  let passwordInput

  function scroll() {
    document.getElementById("inView").scrollIntoView({ behavior: "auto" })
  }

  function passwordSubmit(event) {
    event.preventDefault()
    if (passwordInput.value != rootPassword) {
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
      if (firstSudoComm() != null) {
        doCommand(firstSudoComm())
        setFirstSudoComm(null)
      }
    }
  }

  function doCommand(command) {
    if (validateCommandRepeat(command)) {
      let position = command.command.slice(1)
      command = { ...commandHistory()[parseInt(position)] }
    }
    command.counter = commandCount()

    let updatedHistory = [...commandHistory(), command]
    setCommandHistory(updatedHistory)
    setHistoryPointer(updatedHistory.length - 1)

    switch (command.command) {
      case "sudo":
        if (hasProblem(command, user) == "") {
          if (command.args.length > 0) {
            let addedCommand = { "command": command.args[0], "args": [...command.args], "text": command.args.join(" "), "counter": 0 }
            addedCommand.args.shift()
            setFirstSudoComm(addedCommand)
          }
          setSudoRoutine(true)
        }
        break;
      case "history":
        command.history = [...commandHistory()]
        break
      case "exit":
        command.wasSudo = user().userName == "root"
        if (hasProblem(command, user) == "") {
          if (command.wasSudo) {
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
        break
      case "crt":
        command.wasCrt = crt()
        if (hasProblem(command, user) == "") {
          setCrt(() => !crt())
          updateFinals(command.command)
        }
        break
      case "snake":
        if (hasProblem(command, user) == "") {
          setSnakeActive(true)
          updateFinals(command.command)
        }
        break

      case "invert":
        if (hasProblem(command, user) == "") {
          setInvertColor(!invertColor())
          updateFinals(command.command)
        }
        break

      case "myopia":
        if (hasProblem(command, user) == "") {
          setMyopia(!myopia())
          updateFinals(command.command)
        }
        break
      case "fsociety":
        if (hasProblem(command, user) == "") {
          updateFinals(command.command)
        }
        break
      case "sickbug":
        if (hasProblem(command, user) == "") {
          updateFinals(command.command)
        }
        break
      case "ls":
        if (hasProblem(command, user) == "") {
          command.pass = rootPassword
        }
        break
    }

    let updateOldCom = [...oldCommands(), command]
    setOldCommands(updateOldCom)

    if (command.command == "clear") setOldCommands([])

    setCommandCount(commandCount() + 1)
    inputCommand.value = ""
    setPossiblesTabCompl([])

    scroll()
  }

  function commandSubmit(event) {
    event.preventDefault();
    if (isEmptyOrSpaces(inputCommand.value)) return
    let command = {}
    command.text = inputCommand.value
    let string = inputCommand.value
    let words = string.replace(/\s+/g, ' ').trim().split(" ");
    command.command = words[0]
    words.shift()
    command.args = [...words]
    command.options = {}
    doCommand(command)
  }

  onMount(() => {
    document.body.addEventListener("click", () => {
      let commandInEl = document.getElementById("commandInput")
      let passwdInEl = document.getElementById("passwordInput")
      commandInEl && commandInEl.focus()
      passwdInEl && passwdInEl.focus()
    })
    addEvent(document, "keydown", (e) => {
      e = e || window.event;
      e.Handled = true
      if (e.keyCode == 9 && !sudoRoutine()) tabComplete(e)
      if ((e.keyCode == 38 || e.keyCode == 40) && !snakeActive()) historyNavigate(e)
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


  createEffect(() => {
    if (!finals()["best player"].done && snakePointCounter() >= 5)
      updateFinals("best player");
  })


  function tabComplete(e) {
    e.preventDefault()
    let possibles = []
    let wordToCompareArr = inputCommand.value.replace(/\s+/g, ' ').trim().split(" ")
    let wordToCompare = wordToCompareArr.pop()
    if (wordToCompareArr.length > 0 && (["cat", ">>", "empty"].includes(wordToCompareArr[wordToCompareArr.length - 1])))
      filesArr.forEach(file => {
        if (wordToCompare.toUpperCase() == file.title.slice(0, wordToCompare.length).toUpperCase())
          possibles.push(file.title)
      });
    else
      Object.keys(commandList).forEach(comm => {
        if (wordToCompare.toUpperCase() == comm.slice(0, wordToCompare.length).toUpperCase())
          possibles.push(comm)
      });
    if (possibles.length == 1) {
      wordToCompareArr.push(possibles[0])
      inputCommand.value = wordToCompareArr.join(" ")
      setPossiblesTabCompl([])
      return
    }
    setPossiblesTabCompl(possibles)
    scroll()
  }

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

  function updateFinals(finalToAdd) {
    let newFinalsObj = { ...finals() }
    if (newFinalsObj.hasOwnProperty(finalToAdd)) {
      newFinalsObj[finalToAdd].done = true
      localStorage.setItem("finals", JSON.stringify(newFinalsObj))
      setFinals(newFinalsObj)
    }
  }
  function resetGame() {
    localStorage.removeItem("finals")
    localStorage.removeItem("Files")
    setFinals(finalsObj)

    setCommandHistory([])
    setOldCommands([])
    setPossiblesTabCompl([])
    setHistoryPointer(-1)
    setCommandCount(0)
    setWindowDim([window.innerWidth, window.innerHeight])
    setFirstSudoComm(null)

    setUser({ "userName": "guest" })

    setStartupLogo(true)
    setCrt(false)
    setSudoRoutine(false)
    setWrongPass(false)
    setSnakeActive(false)
    setSnakePointCounter(1)
    setInvertColor(false)
    setMyopia(false)
    document.location.reload(true)
  }

  return ((windowDim()[0] < 950 || windowDim()[1] < 600) ? (<div className="w-full h-screen overflow-y-auto bg-background p-4 text-lg">
    <div class='w-full h-full font-mono leading-5 selection:bg-orange selection:text-black bg-background text-white border-2 border-orange rounded-2xl p-4 flex flex-row items-center justify-center'>
      <div className="min-w-fit min-h-fit flex flex-col items-end ">
        <p className="text-xl">A {(windowDim()[0] < 950 && windowDim()[1] < 600) ? "bigger" : (windowDim()[0] < 950 ? "wider" : "taller")} screen is needed to use this website.</p>
        <p className="pl-14 mt-4 text-md">~developerTeam</p>
      </div>
    </div>
  </div>) : (
    <div class={(crt() ? "crt " : " ") + (invertColor() ? " invert rotate-180 -scale-x-1 " : "") + ' overflow-hidden w-full h-screen overflow-y-auto bg-background p-4 text-lg'}>
      {myopia() ? <div div className="w-full h-screen absolute inset-0 z-50 backdrop-blur-sm pointer-events-none" ></div > : <></>
      }
      <div
        className=" absolute z-[4] right-2 bottom-2 p-2 border-2 border-orange rounded-lg font-mono bg-background hover:bg-red hover:font-bold text-white hover:text-black cursor-pointer"
        onClick={resetGame}
      ><p>Reset Game</p></div>
      <div className="absolute z-[4] top-2 right-2 min-w-fit">
        <div className="relative w-full h-full grid grid-cols-4 grid-flow-row gap-3">
          <For each={Object.keys(finals()).filter((f => !finals()[f].secret))} fallback={<></>}>
            {fin => <div tooltip-title={(finals()[fin].done ? fin : null)} className={(finals()[fin].done ? " bg-orange " : " bg-background  ") + " final w-5 h-5 rounded-full border-2 border-orange"}></div>}
          </For>
          <For each={Object.keys(finals()).filter((f => finals()[f].secret))} fallback={<></>}>
            {fin => <div tooltip-title={(finals()[fin].done ? fin : null)} className={(finals()[fin].done ? " bg-red border-red " : " bg-transparent border-transparent  ") + " final w-5 h-5 rounded-full border-2"}></div>}
          </For>
        </div>
      </div>
      <Show when={snakeActive()}><div id="SnakeDiv" className=" text-white font-mono absolute top-[15%] left-1/4 w-min min-h-fit flex flex-col gap-1 items-center justify-start" >
        <div className="h-8 w-[419px] z-[4] border-2 border-orange bg-background rounded-lg flex flex-row items-center justify-between">
          <svg className="w-auto h-full stroke-2 text-red cursor-pointer" onClick={() => setSnakeActive(false)} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          <p className="px-2">{snakePointCounter()}</p>
        </div>
        <Gamezone snakeCounter={snakePointCounter} setSnakeCounter={setSnakePointCounter} updateFinals={updateFinals} />
      </div></Show>
      <div class='relative scrollbar-hide w-full h-full font-mono leading-5 overflow-y-scroll selection:bg-orange selection:text-black bg-background text-white border-2 border-orange rounded-2xl p-4'>
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
  ))
}

export default App;
