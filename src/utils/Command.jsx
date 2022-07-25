import { filesArr } from "./Files"
import { fsociety, sickBug } from "./Texts"

export const commandList = {
    "help": {
        "info": "Display all commands available",
        "exec": (c, u) => <div className="min-h-fit flex flex-col gap-y-0.5 items-start">
            <For each={Object.keys(commandList)} fallback={<></>}>
                {i => commandList[i].hasOwnProperty("secret") && commandList[i].secret ? (<></>) : (<div className="flex flex-row min-w-fit"><p className={styleComm.code + " w-[10rem]"}>{i}</p><p>{commandList[i].info}</p></div>)}
            </For>
        </div>
    },
    "whoami": {
        "info": "A silly question dont you think?",
        "exec": (c, u) => u().userName == "root" ? <p>"The chosen one"</p> : <p>"The fundamental question"<br />Better of searching some answers at a grater level.</p>
    },
    "sudo": {
        "info": "Grants root access",
        "exec": (c, u) => <></>,
        "usage": ["sudo", "sudo <command to exec as sudo>"],
        "validation": (c, u) => { return u().userName == "root" ? "unable" : "" }
    },
    "info": {
        "info": "Gives general information",
        "exec": (c, u) => <p>Site made for fun</p>
    },
    "clear": {
        "info": "Clears terminal",
        "exec": (c, u) => <></>
    },
    "echo": {
        "info": "Prints the arguments or writes the argument to file using redirect",
        "usage": ["echo <message to print>", "echo <message to write> >> <file to write to>"],
        "exec": echo,
    },
    "empty": {
        "info": "Clear file content",
        "usage": ["empty <file name>"],
        "exec": empty,
    },
    "specials": {
        "info": "Gives info about special commands",
        "exec": (c, u) => <p>Use <span className={styleComm.code}>{"!<command counter>"}</span> refering to the number given using the <span className={styleComm.code}>{"history"}</span> command, to exec the same command again</p>,
    },
    "exit": {
        "info": "Exit current situation",
        "exec": exit,
    },
    "man": {
        "info": "Show info about specific command",
        "exec": man,
        "usage": ["man <command>"],
        "description": "man is the system's manual pager. Each page argument given to man is normally the \
        name of a program, utility or function. The manual page associated with each of these argu‐\
        ments is then found and displayed. A section, if provided, will direct man to look only in that section \
        of the manual. The default action is to search in all of the available \
        sections following a pre-defined order, and to show only the first page found, \
        even if page exists in several sections.",
    },
    "ls": {
        "info": "Show content of current directory",
        "flags": { "l": "Shows more informations about the files listed" },
        "exec": ls,
    },
    "cat": {
        "info": "Show content of specified file",
        "usage": ["cat <filename>"],
        "exec": cat,
    },
    "crt": {
        "info": "Surprise, feeling 80's vibes!",
        "exec": crt,
        "validation": (c, u) => u().userName == "root" ? "" : "missingPerm",
    },
    "snake": {
        "info": "Nice choise! A good game, for a good man",
        "exec": (c, u) => <p>Nice job!</p>,
        "validation": (c, u) => u().userName == "root" ? "" : "missingPerm"
    },
    "invert": {
        "info": "Inverts color, and something more...",
        "exec": (c, u) => <p>Are you sure?</p>,
        "validation": (c, u) => u().userName == "root" ? "" : "missingPerm"
    },
    "myopia": {
        "info": "Have you find your glasses?",
        "exec": (c, u) => <p>Have you found your glasses?</p>,
        "validation": (c, u) => u().userName == "root" ? "" : "missingPerm"
    },
    "fsociety": {
        "info": "Dont mind if i do...",
        "exec": (c, u) => <pre>{fsociety}</pre>,
        "secret": true,
    },
    "sickbug": {
        "info": "I'm not sure if it is a good idea.",
        "exec": (c, u) => <pre>{sickBug}</pre>,
        "secret": true,
    },
    "history": {
        "info": "Show past commands",
        "exec": (c, u) => c.hasOwnProperty("history") ? <div>
            <For className="" each={c.history} fallback={<p>No past commands given</p>}>
                {i => <div className="min-w-fit min-h-full flex flex-row items-start justify-start"><p className="w-[3rem]">{i.counter}</p><p>{i.text}</p></div>}
            </For>
        </div> :
            <></>
    }
}

// Using _ to make everything 5 char
// var alphabetMorse = {
//     'a': '_•-__', 'b': '-•••_', 'c': '-•-•_', 'd': '_-••_',
//     'e': '__•__', 'f': '••-•_', 'g': '_--•_', 'h': '••••_',
//     'i': '_••__', 'j': '•---_', 'k': '_-•-_', 'l': '•-••_',
//     'm': '_--__', 'n': '_-•__', 'o': '_---_', 'p': '•--•_',
//     'q': '--•-_', 'r': '_•-•_', 's': '_•••_', 't': '__-__',
//     'u': '_••-_', 'v': '•••-_', 'w': '_•--_', 'x': '-••-_',
//     'y': '-•--_', 'z': '--••_', ' ': '__/__',
//     '1': '•----', '2': '••---', '3': '•••--', '4': '••••-',
//     '5': '•••••', '6': '-••••', '7': '--•••', '8': '---••',
//     '9': '----•', '0': '-----',
// }

// Clean
var alphabetMorse = {
    'a': '•-', 'b': '-•••', 'c': '-•-•', 'd': '-••',
    'e': '•', 'f': '••-•', 'g': '--•', 'h': '••••',
    'i': '••', 'j': '•---', 'k': '-•-', 'l': '•-••',
    'm': '--', 'n': '-•', 'o': '---', 'p': '•--•',
    'q': '--•-', 'r': '•-•', 's': '•••', 't': '-',
    'u': '••-', 'v': '•••-', 'w': '•--', 'x': '-••-',
    'y': '-•--', 'z': '--••', ' ': '/',
    '1': '•----', '2': '••---', '3': '•••--', '4': '••••-',
    '5': '•••••', '6': '-••••', '7': '--•••', '8': '---••',
    '9': '----•', '0': '-----',
}

// Using " " to make everything 5 char 
// var alphabetMorse = {
//     'a': ' •-  ', 'b': '-••• ', 'c': '-•-• ', 'd': ' -•• ',
//     'e': '  •  ', 'f': '••-• ', 'g': ' --• ', 'h': '•••• ',
//     'i': ' ••  ', 'j': '•--- ', 'k': ' -•- ', 'l': '•-•• ',
//     'm': ' --  ', 'n': ' -•  ', 'o': ' --- ', 'p': '•--• ',
//     'q': '--•- ', 'r': ' •-• ', 's': ' ••• ', 't': '  -  ',
//     'u': ' ••- ', 'v': '•••- ', 'w': ' •-- ', 'x': '-••- ',
//     'y': '-•-- ', 'z': '--•• ', ' ': '  /  ',
//     '1': '•----', '2': '••---', '3': '•••--', '4': '••••-',
//     '5': '•••••', '6': '-••••', '7': '--•••', '8': '---••',
//     '9': '----•', '0': '-----',
// }

export const styleComm = {
    "validateStyle": (command, userStatus) => hasProblem(command, userStatus) == "" ? " text-green " : " text-red ",
    "code": " text-orange ",
}

export function hasProblem(c, u) {
    if (!Object.keys(commandList).includes(c.command))
        return "notExists"


    if (commandList[c.command].hasOwnProperty("validation")) {
        return commandList[c.command].validation(c, u)
    }

    if (Object.keys(commandList).includes(c.command))
        return ""

    return "unable"
}

export function validateCommandRepeat(c) {
    return /![\d]+/gm.test(c.text)
}

export function execCommand(c, u) {
    let validation = hasProblem(c, u)
    if (validation == "")
        return commandList[c.command].exec(c, u)
    else
        switch (validation) {
            case "notExists":
                return notCommand(c)
            case "unable":
                return unableCommand(c)
            case "missingPerm":
                return missingPermsCommand(c)

            default:
                return missingPermsCommand(c)
        }
}

function empty(c, u) {
    if (c.hasOwnProperty("args") && c.args.length == 1) {
        let indexOfFile = filesArr.findIndex(f => f.title == c.args[0])
        if (indexOfFile == -1) return <p>File <span className={styleComm.code}>{c.args[indexOfRedir + 1]}</span> does not exists</p>
        if (filesArr[indexOfFile].perms.includes("write")) {
            if ((filesArr[indexOfFile].perms.includes("all") || (filesArr[indexOfFile].perms.includes("root") && u().userName == "root"))) {
                filesArr[indexOfFile].content = ""
                localStorage.setItem("Files", JSON.stringify(filesArr))
                return <p>File <span className={styleComm.code}>{c.args[0]}</span> emptied</p>
            }
            return <p>Insufficent permissions to modify file <span className={styleComm.code}>{c.args[0]}</span></p>
        }
        return <p>Can not modify file <span className={styleComm.code}>{c.args[0]}</span></p>
    }
    return <p>Usage: <span className={styleComm.code}>{"empty <fileName>"}</span></p>
}

function echo(c, u) {
    if (c.hasOwnProperty("args") && c.args.length > 0) {
        let indexOfRedir = c.args.findIndex(a => a == ">>")
        if (indexOfRedir != -1) {
            if (indexOfRedir == 0) return <p>No message to write given</p>
            let indexOfFile = filesArr.findIndex(f => f.title == c.args[indexOfRedir + 1])
            if (indexOfFile == -1) return <p>File <span className={styleComm.code}>{c.args[indexOfRedir + 1]}</span> does not exists</p>
            if (filesArr[indexOfFile].perms.includes("write")) {
                if ((filesArr[indexOfFile].perms.includes("all") || (filesArr[indexOfFile].perms.includes("root") && u().userName == "root"))) {
                    let toWrite = c.args.slice(0, indexOfRedir).join(" ")
                    if (toWrite[0] == '"' && toWrite[toWrite.length - 1] == '"') toWrite = toWrite.substring(1, toWrite.length - 1)
                    if (filesArr[indexOfFile].title == "variables.env") {
                        if (!validateEnv(toWrite))
                            return <p>Wrong environment variable:  <span className={styleComm.code}>{toWrite}</span></p>
                    }
                    filesArr[indexOfFile].content += ((filesArr[indexOfFile].content == "" ? "" : "\n") + toWrite)
                    localStorage.setItem("Files", JSON.stringify(filesArr))
                    return <></>
                }
                else {
                    return <p>Insufficent permissions to write to file <span className={styleComm.code}>{c.args[indexOfRedir + 1]}</span></p>
                }
            }
            else
                return <p>Can not write to file <span className={styleComm.code}>{c.args[indexOfRedir + 1]}</span></p>
        }
        let toPrint = c.args.join(" ")
        if (toPrint[0] == '"' && toPrint[toPrint.length - 1] == '"') toPrint = toPrint.substring(1, toPrint.length - 1)
        return <p>{toPrint}</p>
    }
    return <p>No arguments given</p>
}

function validateEnv(env) {
    let cleanEnv = env.replace(/\s/g, '').toLowerCase();
    let cleanEnvArr = cleanEnv.split(":")
    let envKey = cleanEnvArr[0]
    let envTok = cleanEnvArr[1]
    switch (envKey) {
        case "snake":
            if (envTok == "free") return true
            return false

        default:
            return false
    }
}

export function searchEnv(env) {
    let localStorageFiles = JSON.parse(localStorage.getItem("Files"))
    let varEnv = filesArr.findIndex(f => f.title == "variables.env")
    if (varEnv == -1) return null
    let envFile = { ...filesArr[varEnv] }
    let contentArr = envFile.content.split(/\r?\n/)
    let indexOfEnv = contentArr.findIndex(e => e.replace(/\s/g, '').toLowerCase().split(":")[0] == env)
    if (indexOfEnv == -1) return ""
    return contentArr[indexOfEnv].replace(/\s/g, '').toLowerCase().split(":")[1]
}

function exit(c, u) {
    if (c.hasOwnProperty("wasSudo") && c.wasSudo)
        return <p>Exiting sudo!</p>
    else
        return <p>Nothing to exit!</p>
}

function man(c, u) {
    if (c.args.length != 1) return <p>Usage: <span className={styleComm.code}>man {"<command>"}</span></p>
    if (Object.keys(commandList).includes(c.args[0])) return (
        <div className="min-h-fit w-full flex flex-col">
            <p className="font-bold">INFO</p>
            <div className="flex flex-row min-w-fit pl-2">
                <p className={styleComm.code + " w-[7rem]"}>{c.args[0]}</p><p>{commandList[c.args[0]].info}</p>
            </div>
            <Show when={commandList[c.args[0]].hasOwnProperty("usage")}>
                <p className="font-bold">Usage</p>
                <div className="flex flex-col items-start">
                    <For each={commandList[c.args[0]].usage} fallback={<></>}>
                        {us => <p className={styleComm.code + " pl-2"}>{us}</p>}
                    </For>
                </div>
            </Show>
            <Show when={commandList[c.args[0]].hasOwnProperty("flags")}>
                <p className="font-bold">Flags</p>
                <div className="flex flex-col items-start">
                    <For each={Object.keys(commandList[c.args[0]].flags)} fallback={<></>}>
                        {fl => <div className="flex flex-row"><p className={styleComm.code + " pl-2 w-[3rem]"}>-{fl}</p><p>{commandList[c.args[0]].flags[fl]}</p></div>}
                    </For>
                </div>
            </Show>
            <Show when={commandList[c.args[0]].hasOwnProperty("description")}>
                <p className="font-bold">Description</p>
                <p className=" pl-2">{commandList[c.args[0]].description}</p>
            </Show>
        </div>
    )
    else return <p>Command <span className={styleComm.code}>{c.args[0]}</span> does not exits</p>
}

function crt(c, u) {
    if (c.hasOwnProperty("wasCrt") && c.wasCrt) return <p>Awww...</p>
    return <p>Nice!</p>
}

function ls(c, u) {
    if (c.hasOwnProperty("args") && c.args.length == 1) {
        if (c.args[0] == "-l") {
            return <div className="min-h-fit w-full grid grid-cols-4 gap-x-3 gap-y-0.5 grid-flow-row-dense items-start">
                <For each={filesArr} fallback={<></>}>
                    {(file, i) => <>
                        <div className="min-w-fit grid grid-cols-3 items-center justify-evenly">
                            {[...Array(3)].map((e) => <pre className="px-1 w-full flex flex-row items-center justify-center">{c.pass[i()] ? alphabetMorse[c.pass[i()]] : alphabetMorse[" "]}</pre>)}
                        </div>
                        <p className="min-w-fit">{file.creator}</p>
                        <p className="min-w-fit">{file.creation}</p>
                        <p className="min-w-fit">{file.title}</p></>}
                </For>
            </div>
        }
    }
    return <div className="min-h-fit w-full flex flex-row flex-wrap gap-4 items-start">
        <For each={filesArr} fallback={<></>}>
            {file => <p>{file.title}</p>}
        </For>
    </div>

}

function cat(c, u) {
    if (c.args.length != 1) return <p>Usage: <span className={styleComm.code}>cat {"<filename>"}</span></p>
    let indexOfFile = filesArr.findIndex(file => file.title == c.args[0])
    if (indexOfFile != -1) {
        if (filesArr[indexOfFile].perms.includes("all") || (filesArr[indexOfFile].perms.includes("root") && u().userName == "root"))
            return <pre>{filesArr[indexOfFile].content}</pre>
        else
            return <p>Insufficent permission to view <span className={styleComm.code}>{c.args[0]}</span> content</p>

    }
    else {
        return <p>File <span className={styleComm.code}>{c.args[0]}</span> does not exists in this directiory</p>
    }
}

function notCommand(c) {
    return <p>Command <span className={styleComm.code}>{c.text}</span> does not exists</p>
}
function unableCommand(c) {
    return <p>Can't run <span className={styleComm.code}>{c.text}</span> at the moment</p>
}

function missingPermsCommand(c) {
    return <p>Insufficent permission to run <span className={styleComm.code}>{c.text}</span></p>
}
