import { execCommand, styleComm } from "../utils/Command";
import Prompt from "./Prompt";

function OldCommand({ command, user }) {
    return (
        <div className="w-full min-h-fit flex flex-col items-start justify-start">
            <div className="w-full min-h-fit flex flex-row gap-2">
                <Prompt user={user} />
                <div>
                    <pre className={styleComm.validateStyle(command, user) + " font-bold"}>{command.text}</pre>
                </div>
            </div>
            <div className="pl-2 ">{execCommand(command, user)}</div>
        </div>
    )
}

export default OldCommand;