export const commandList = {
    "help": {
        "info": "Display all commands available",
        "exec": (c) => <div className="min-h-fit flex flex-col items-start">
            <For each={Object.keys(commandList)} fallback={<></>}>
                {i => (<div className="flex flex-row min-w-fit"><p className={styleComm.code + " w-[10rem]"}>{i}</p><p>{commandList[i].info}</p></div>)}
            </For>
        </div>
    },
    "whoami": {
        "info": "A silly question dont you think?",
        "exec": (c) => <p>"The fundamental question"</p>
    },
    "sudo": {
        "info": "Grants root access",
        "exec": (c) => <></>,
        "validation": (c, u) => { console.log(u().userName); return u().userName == "root" ? "unable" : "" }
    },
    "info": {
        "info": "Gives general information",
        "exec": (c) => <p>Site made for fun</p>
    },
    "clear": {
        "info": "Clears terminal",
        "exec": (c) => <></>
    },
    "echo": {
        "info": "Prints the arguments",
        "exec": echo,
    },
    "specials": {
        "info": "Gives info about special commands",
        "exec": (c) => <p>Use <span className={styleComm.code}>{"!<command counter>"}</span> to exec the same command again</p>,
    },
    "exit": {
        "info": "Exit current situation",
        "exec": exit,
    },
    "man": {
        "info": "Show info about specific command",
        "exec": man,
        "usage": "man <command>",
        "description": "man is the system's manual pager. Each page argument given to man is normally the \
        name of a program, utility or function. The manual page associated with each of these argu‐\
        ments is then found and displayed. A section, if provided, will direct man to look only in that section \
        of the manual. The default action is to search in all of the available \
        sections following a pre-defined order, and to show only the first page found, \
        even if page exists in several sections.",
    },
    "crt": {
        "info": "Surprise (need sudo)",
        "exec": crt,
        "validation": (c, u) => u().userName == "root" ? "" : "missingPerm",
    },
    "snake": {
        "info": "Nice choise",
        "exec": (c) => <p>Nice job!</p>,
        "validation": (c, u) => u().userName == "root" ? "" : "missingPerm"
    },
    "invert": {
        "info": "Inverts color",
        "exec": (c) => <p>Are you sure?</p>,
        "validation": (c, u) => u().userName == "root" ? "" : "missingPerm"
    },
    "myopia": {
        "info": "Have you find your glasses?",
        "exec": (c) => <p>Have you find your glasses?</p>,
        "validation": (c, u) => u().userName == "root" ? "" : "missingPerm"
    },
    "history": {
        "info": "Show past commands",
        "exec": (c) => c.hasOwnProperty("history") ? <div>
            <For className="" each={c.history} fallback={<p>No past commands given</p>}>
                {i => <div className="min-w-fit min-h-full flex flex-row items-start justify-start"><p className="w-[3rem]">{i.counter}</p><p>{i.text}</p></div>}
            </For>
        </div> :
            <></>
    }
}

export const styleComm = {
    "validateStyle": (command, userStatus) => hasProblem(command, userStatus) == "" ? " text-green " : " text-red ",
    "code": " text-orange ",
}

export function hasProblem(c, u) {
    if (!Object.keys(commandList).includes(c.command))
        return "notExists"


    if (commandList[c.command].hasOwnProperty("validation")) {
        console.log("running custom validation")
        console.log("custom validation = " + commandList[c.command].validation(c, u))
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
        return commandList[c.command].exec(c)
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

function echo(c) {
    if (c.hasOwnProperty("args") && c.args.length > 0)
        return <p>{c.args.join(" ")}</p>
    return <p>No arguments given</p>
}

function exit(c) {
    if (c.hasOwnProperty("wasSudo") && c.wasSudo)
        return <p>Exiting sudo!</p>
    else
        return <p>Nothing to exit!</p>
}

function man(c) {
    if (c.args.length != 1) return <p>Usage: <span className={styleComm.code}>man {"<command>"}</span></p>
    if (Object.keys(commandList).includes(c.args[0])) return (
        <div className="min-h-fit w-full flex flex-col">
            <p className="font-bold">INFO</p>
            <div className="flex flex-row min-w-fit pl-2">
                <p className={styleComm.code + " w-[7rem]"}>{c.args[0]}</p><p>{commandList[c.args[0]].info}</p>
            </div>
            <Show when={commandList[c.args[0]].hasOwnProperty("usage")}>
                <p className="font-bold">Usage</p>
                <p className={styleComm.code + " pl-2"}>{commandList[c.args[0]].usage}</p>
            </Show>
            <Show when={commandList[c.args[0]].hasOwnProperty("description")}>
                <p className="font-bold">Description</p>
                <p className=" pl-2">{commandList[c.args[0]].description}</p>
            </Show>
        </div>
    )
    else return <p>Command <span className={styleComm.code}>{c.args[0]}</span> does not exits</p>
}

function crt(c) {
    if (c.hasOwnProperty("wasCrt") && c.wasCrt) return <p>Awww...</p>
    return <p>Nice!</p>
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