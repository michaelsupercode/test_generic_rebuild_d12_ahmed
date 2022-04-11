const fs = require("fs")

const todosJsonFilePath = __dirname + "/../data/todos.json"

function readTodos() {
    return new Promise((resolve, reject) => {
        // asnyc code comes here inside promise callback...
        fs.readFile(todosJsonFilePath, (err, data) => {
            if(err) {
                reject(err)
                return
            }
            const todosJsonString = data.toString() // Buffer in String umwandenln
            const todos = JSON.parse(todosJsonString) // json string in tatsächliches array umwandeln
            
            resolve(todos)
        })
    })
}

function writeTodos(todosArray) {
    return new Promise((resolve, reject) => {
        // async code comes here..
        const todosJSONString = JSON.stringify(todosArray, null, 2) // wandle das array in ein JSON string um
        fs.writeFile(todosJsonFilePath, todosJSONString, (err) => {
            if(err) reject(err)
            else resolve(todosArray) // ich gebe das ganze array wieder zurück, als zeichen, dass alles geklappt hat
        })
    })
}

module.exports = {
    readTodos,
    writeTodos
}