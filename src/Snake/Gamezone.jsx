import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import Food from "./Food";
import Snake from "./Snake";

function Gamezone({ snakeCounter, setSnakeCounter }) {
    function getRandomCoordinates() {
        let min = 0;
        let max = 25;
        let x = Math.floor(Math.random() * (max - min) + min);
        let y = Math.floor(Math.random() * (max - min) + min);
        return [x, y]
    }
    let interval

    const [foodCoord, setFoodCoord] = createSignal([12, 12])
    const [speed, setSpeed] = createSignal(200)
    const [direction, setDirection] = createSignal("RIGHT")
    const [canUpdateDir, setCanUpdateDir] = createSignal(true)
    const [isGameOver, setIsGameOver] = createSignal(false)
    const [snakeDots, setSnakeDots] = createSignal([[0, 12], [1, 12]])

    onMount(() => {
        setSnakeCounter(1)
        interval = setInterval(() => {
            moveSnake()
        }, speed());
    })

    onCleanup(() => {
        clearInterval(interval)
        setSnakeCounter(1)
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
        setCanUpdateDir(true)
        checkIfOutOfBorders()
        checkIfCollapsed()
        checkIfEat()
    }

    function checkIfOutOfBorders() {
        let head = snakeDots()[snakeDots().length - 1];
        if (head[0] >= 25 || head[1] >= 25 || head[0] < 0 || head[1] < 0) {
            onGameOver();
        }
    }

    function checkIfCollapsed() {
        let snake = [...snakeDots()];
        let head = snake[snake.length - 1];
        snake.pop();
        if (snake.find(dot => head[0] == dot[0] && head[1] == dot[1])) onGameOver()
    }

    function checkIfEat() {
        let head = snakeDots()[snakeDots().length - 1];
        let food = foodCoord();
        if (head[0] == food[0] && head[1] == food[1]) {
            setFoodCoord(getRandomCoordinates())
            enlargeSnake();
            increaseSpeed();
            setSnakeCounter(snakeCounter() + 1)
        }
    }

    function enlargeSnake() {
        let newSnake = [snakeDots()[0], ...snakeDots()]
        setSnakeDots(newSnake)
    }

    function increaseSpeed() {
        if (speed() > 70) {
            setSpeed(speed() - 10)
        }
    }


    function onGameOver() {
        setIsGameOver(true)
        setFoodCoord([12, 12])
        setSpeed(200)
        setDirection("RIGHT")
        setSnakeDots([[0, 12], [1, 12]])
        setSnakeCounter(1)
    }


    onMount(() => {
        addEvent(document, "keydown", (e) => {
            e = e || window.event;
            // e.Handled = true
            switch (e.keyCode) {
                case 38:
                    if (direction() == "DOWN") break
                    if (canUpdateDir()) {
                        setCanUpdateDir(false)
                        setDirection("UP")
                    }
                    break;
                case 40:
                    if (direction() == "UP") break
                    if (canUpdateDir()) {
                        setCanUpdateDir(false)
                        setDirection("DOWN")
                    }
                    break;
                case 37:
                    if (direction() == "RIGHT") break
                    if (canUpdateDir()) {
                        setCanUpdateDir(false)
                        setDirection("LEFT")
                    }
                    break;
                case 39:
                    if (direction() == "LEFT") break
                    if (canUpdateDir()) {
                        setCanUpdateDir(false)
                        setDirection("RIGHT")
                    }
                    break;
            }
        })
    })

    function addEvent(element, eventName, callback) {
        if (element.addEventListener) {
            element.addEventListener(eventName, callback, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + eventName, callback);
        } else {
            element["on" + eventName] = callback;
        }
    }

    return (
        <div className="relative z-[4] w-min min-h-fit p-2 border-2 border-orange bg-background rounded-lg font-mono">
            {!isGameOver() ?
                <div className="relative z-[5] w-[400px] h-[400px]">
                    <Snake snakeDots={snakeDots} />
                    <Food dot={foodCoord} />
                </div>
                :
                <div className="flex flex-row items-center justify-center z-[5] w-[400px] h-[400px]">
                    <p className="border-2 rounded-xl border-orange bg-red p-5 font-bold text-2xl text-black">GameOver</p>
                </div>
            }
        </div >
    )
}

export default Gamezone;