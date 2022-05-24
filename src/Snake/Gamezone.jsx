import { createSignal, onCleanup, onMount } from "solid-js";
import Food from "./Food";
import Snake from "./Snake";

// const getRandomCoordinates = () => {
//     let min = 1;
//     let max = 20;
//     let x = Math.floor((Math.random() * (max - min + 1) + min) / 2);
//     let y = Math.floor((Math.random() * (max - min + 1) + min) / 2);
//     return [x, y]
// }

function Gamezone() {
    function getRandomCoordinates() {
        let min = 1;
        let max = 20;
        let x = Math.floor((Math.random() * (max - min + 1) + min) / 2);
        let y = Math.floor((Math.random() * (max - min + 1) + min) / 2);
        return [x, y]
    }
    let interval

    const [food, setFood] = createSignal(getRandomCoordinates())
    const [speed, setSpeed] = createSignal(200)
    const [direction, setDirection] = createSignal("RIGHT")
    const [snakeDots, setSnakeDots] = createSignal([[0, 0], [1, 0]])

    onMount(() => {
        interval = setInterval(() => {
            moveSnake()
        }, speed());
    })

    onCleanup(() => {
        clearInterval(interval)
    })

    function moveSnake() {
        let dots = [...snakeDots()]
        let head = dots[dots.length - 1]

        switch (direction()) {
            case 'RIGHT':
                head = [head[0] + 1, head[1]];
                break;
            case 'LEFT':
                head = [head[0] - 1, head[1]];
                break;
            case 'DOWN':
                head = [head[0], head[1] + 1];
                break;
            case 'UP':
                head = [head[0], head[1] - 1];
                break;
        }
        dots.push(head)
        dots.shift()
        setSnakeDots(dots)
    }

    return (
        <div className="bg-sky-200 relative z-[4] w-min min-h-fit p-2 border-2 border-orange rounded-2xl ">
            <div className="bg-sky-400 relative z-[5] w-[400px] h-[400px]">
                <Snake snakeDots={snakeDots} />
                <Food dot={food} />
            </div>
            <button onClick={() => { console.log("hello"); setFood(getRandomCoordinates()) }}>Gen Coord</button>
            <button onClick={() => clearInterval(interval)}>remove interval</button>
        </div >
    )
}

export default Gamezone;