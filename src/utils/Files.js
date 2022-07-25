const defaultFiles = [
    {
        "title": "Whoami.txt",
        "content": `Something is telling me that to get more infomation is needed a grater level of "power"...\nSomewere where the power needed to access is told perhaps I will find my answers.`,
        "creation": "1974-03-14",
        "creator": "placeholder",
        "perms": "all",
    },
    {
        "title": "test.txt",
        "content": "A simple test, dont worry about it...",
        "creation": "1982-05-04",
        "creator": "placeholder",
        "perms": "root",
    },
    {
        "title": "variables.env",
        "content": "taxes:pending",
        "creation": "1982-5-4",
        "creator": "god",
        "perms": "all write",
    },
    {
        "title": "expenses.txt",
        "content": "",
        "creation": "1982-5-4",
        "creator": "placeholder",
        "perms": "block",
    },
    {
        "title": "oldHabits.txt",
        "content": "",
        "creation": "1982-5-4",
        "creator": "placeholder",
        "perms": "block",
    },
    {
        "title": "write.txt",
        "content": "",
        "creation": "1982-5-4",
        "creator": "testToWrite",
        "perms": "all write",
    },
]

export var filesArr = localStorage.getItem("Files") ? JSON.parse(localStorage.getItem("Files")) : defaultFiles