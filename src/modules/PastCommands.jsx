import OldCommand from "./OldCommand";


function PastCommands({ oldCommands }) {
    return (
        <div id="pastCommands" className="w-full min-h-fit flex flex-col items-start justify-start">
            <For each={oldCommands()} fallback={<></>}>
                {(i) => <OldCommand command={i} />}
            </For>
        </div>
    )
}



export default PastCommands;