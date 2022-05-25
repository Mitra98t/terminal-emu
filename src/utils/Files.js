const defaultFiles = [
    {
        "title": "Whoami.txt",
        "content": "An old developer, i like Snake!",
        "perms": "all"
    },
    {
        "title": "test.txt",
        "content": "A simple test, dont worry about it...",
        "perms": "root"
    },
    {
        "title": "scrivi.txt",
        "content": "",
        "perms": "root write"
    },
]

export var filesArr = localStorage.getItem("Files") ? JSON.parse(localStorage.getItem("Files")) : defaultFiles