import OldCommand from "./OldCommand";


function PastCommands({ oldCommands, user }) {
    return (
        <div id="pastCommands" className="xl:w-1/2 lg:w-2/3 md:w-3/4 min-h-fit flex flex-col items-start justify-start">
            <For each={oldCommands()} fallback={<></>}>
                {(i) => <OldCommand user={user} command={i} />}
            </For>
        </div>
    )
}



export default PastCommands;