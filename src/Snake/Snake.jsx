function Snake({ snakeDots }) {

    return (
        <div>
            <For each={snakeDots()}>
                {(dot) => {
                    console.log(dot)
                    return <div
                        className="absolute w-[5%] h-[5%] bg-black border border-white rounded z-[6]"
                        style={{
                            left: `${dot[0] * 5}%`,
                            top: `${dot[1] * 5}%`
                        }}
                    ></div>
                }}
            </For>
        </div>
    )
}

export default Snake;