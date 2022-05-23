const commandList = {
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
}

export const styleComm = {
    "validateStyle": (command) => validateCommand(command) ? " text-green " : " text-red "
}

export function validateCommand(c) {
    return Object.keys(commandList).includes(c)
}

export function execCommand(c) {
    if (validateCommand(c))
        return commandList[c].exec(c)
    else
        return notCommand(c)
}

function notCommand(c) {
    return <p>Command {c} does not exists</p>

}