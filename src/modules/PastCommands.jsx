import OldCommand from "./OldCommand";


function PastCommands({ oldCommands, user }) {
    return (
        <div id="pastCommands" className="w-full min-h-fit flex flex-col items-start justify-start">
            <For each={oldCommands()} fallback={<></>}>
                {(i) => <OldCommand user={user} command={i} />}
            </For>
        </div>
    )
}



export default PastCommands;