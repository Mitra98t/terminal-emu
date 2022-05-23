const commandList = {
    "help": {
        "info": "Display all commands available",
        "exec": (c) => <div className="min-h-fit flex flex-col items-start">
            <For each={Object.keys(commandList)} fallback={<></>}>
                {i => (<div className="flex flex-row min-w-fit"><p className="w-[10rem]">{i}</p><p>{commandList[i].info}</p></div>)}
            </For>
        </div>
    },
    "whoami": {
        "info": "A silly question dont you think?",
        "exec": (c) => <p>"The fundamental question"</p>
    },
    "sudo": {
        "info": "Grants root access",
        "exec": (c) => <p>Not so fast =)</p>
    },
    "info": {
        "info": "Gives general information",
        "exec": (c) => <p>Site made for fun</p>
    },
    "clear": {
        "info": "Clears terminal",
        "exec": (c) => <></>
    },
    "history": {
        "info": "Show past commands",
        "exec": (c) => c.hasOwnProperty("history") ? <div>
            <For className="" each={c.history} fallback={<p>No past commands given</p>}>
                {i => <p>{i}</p>}
            </For>
        </div> :
            <></>
    }
}

export const styleComm = {
    "validateStyle": (command) => validateCommand(command) ? " text-green " : " text-red "
}

export function validateCommand(c) {
    return Object.keys(commandList).includes(c)
}

export function execCommand(c) {
    if (validateCommand(c.command))
        return commandList[c.command].exec(c)
    else
        return notCommand(c)
}

function notCommand(c) {
    return <p>Command {c} does not exists</p>

}