function Food({ dot }) {
    return (
        <div
            className="absolute w-[4%] h-[4%] bg-red border border-orange rounded"
            style={{
                left: `${dot()[0] * 4}%`,
                top: `${dot()[1] * 4}%`
            }}
        ></div>
    )
}

export default Food;