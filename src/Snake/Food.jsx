function Food({ dot }) {
    return (
        <div
            className="absolute w-[5%] h-[5%] bg-red border border-white rounded"
            style={{
                left: `${dot()[0] * 5}%`,
                top: `${dot()[1] * 5}%`
            }}
        ></div>
    )
}

export default Food;