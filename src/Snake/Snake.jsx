function Snake({ snakeDots }) {

    return (
        <div>
            <For each={snakeDots()}>
                {(dot) => {
                    return <div
                        className="absolute w-[4%] h-[4%] bg-darkBlue border border-green rounded z-[6]"
                        style={{
                            left: `${dot[0] * 4}%`,
                            top: `${dot[1] * 4}%`
                        }}
                    ></div>
                }}
            </For>
        </div>
    )
}

export default Snake;