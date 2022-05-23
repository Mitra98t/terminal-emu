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
    "echo": {
        "info": "Prints the arguments",
        "exec": echo,
    },
    "specials": {
        "info": "Gives info about special commands",
        "exec": (c) => <p>Use <span className={styleComm.code}>{"!<command counter>"}</span> to exec the same command again</p>,
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
    "validateStyle": (command) => validateCommand(command) ? " text-green " : " text-red ",
    "code": " text-orange "
}

export function validateCommand(c) {
    return Object.keys(commandList).includes(c)
}

export function validateCommandRepeat(c){
    return /![\d]+/gm.test(c.text)
}

export function execCommand(c) {
    if (validateCommand(c.command))
        return commandList[c.command].exec(c)
    else
        return notCommand(c)
}

function echo(c) {
    if (c.hasOwnProperty("args") && c.args.length > 0)
        return <p>{c.args.join(" ")}</p>
    return <p>No arguments given</p>
}

function notCommand(c) {
    return <p>Command <span className={styleComm.code}>{c.text}</span>{c} does not exists</p>
}