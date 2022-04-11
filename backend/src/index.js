const express = require("express")
const cors = require("cors")
const { body, validationResult } = require("express-validator")
const nodeId = require("node-id")
const { readTodos, writeTodos } = require("./todos-storage")

const PORT = 9000
const app = express()

app.use(cors())
app.use(express.json()) // body parser

app.use((req, _, next) => {
    console.log("new request –", req.method, req.url)
    next()
})

app.get("/", (_, res) => {
    res.send("it works :)")
})

// Route 1 - alle todos anzeigen
// *   anzeigen       GET      /todos/all          alles todos anzeigen
app.get("/todos/all", (_, res) => {
    readTodos()
    .then(todos => res.json(todos))
    .catch(_ => res.status(500).json({ err: "Unknown error while reading todos." })) 
})

// Neues Todo anlegen
app.post("/todos/new",
    body("title").isLength(1),
    (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            res.status(400).json({ err: "Bad Request. Please include a todo title." })
            return
        }
        
        // schritt 1 - neuen todo title nehmen vom body und todo objekt erstllen
        const newTodo = { id: nodeId(8), title: req.body.title, completed: false }

        // schritt 2 - aktuelle todos einlesen & neues todo objekt in das array einfügen
        readTodos()
        .then(todos => {
            const newTodosArray = [...todos, newTodo] // todos.push(newTodo) geht auch, aber besser ist ein neues Todo anlegen, damit wir kein parameter werte ändern!
            return newTodosArray
        })
        .then((newTodosArray) => writeTodos(newTodosArray)) // schritt 3 - alles wieder in die todos.json datei speichern
        .then((writtenTodosArray) => res.json(writtenTodosArray))
        .catch(_ => res.status(500).json({ err: "Unknown error while reading or writing todos." })) 

        /*
        // alternative schreibweise von Schritt 2 bis 3 
        readTodos()
        .then(todos => [...todos, newTodo]) // neues array returnen mit neuem todo
        .then(writeTodos)   // dieses returnte array schreiben (mit writeTodos)
        .then(res.json)     // den resolve wert von writeTodos in die res.json packen uns senden
        */
    }
)

// ändern         PUT      /todos/updateStatus/:id  -> status ist erledigt oder nicht
app.put("/todos/updateStatus", (req, res) => {
    const targetId = req.body.id
    const newCompleted = req.body.completed

    readTodos()
    .then(todos => {
        const updatedTodosArray = // neues Todo Array mit den geänderten Todo anlegen
            todos.map((todo) => {
                if(todo.id === targetId) {
                    // das gewünschte todo objekte im array finden und überschreiben
                    return { ...todo, completed: newCompleted }
                } else {
                    // alle anderen todos returnen so wie sie sind... (aka keine Änderung)!
                    return todo
                }
            })
        return updatedTodosArray // an das nächste then weitergeben
    })
    .then((updatedTodosArray) => writeTodos(updatedTodosArray)) // schritt 3 - alles wieder in die todos.json datei speichern
    .then((writtenTodosArray) => res.json(writtenTodosArray))
    .catch(_ => res.status(500).json({ err: "Unknown error while reading or writing todos." })) 

})

// löschen        DELETE   /todos/delete/:id
app.delete("/todos/delete/:id", (req, res) => {
    const targetId = req.params.id
    readTodos()
    .then(todos => todos.filter(todo => todo.id !== targetId))
    .then((updatedTodosArray) => writeTodos(updatedTodosArray)) // schritt 3 - alles wieder in die todos.json datei speichern
    .then((writtenTodosArray) => res.json(writtenTodosArray))
    .catch(_ => res.status(500).json({ err: "Unknown error while reading or writing todos." }))
})

app.use((_, res) => {
    res.status(404).json({ err: "Not found."})
})

app.listen(PORT, () => console.log("Server is listening on Port", PORT))


/*

// Schritt 1 -> Datenmodell überlegen und Beispieldaten erstellen (zb todos.json)
todos --> [
    {
        id: 1,
        title: "Ruf Elon an",
        completed: false
    },
    {
        id: 2,
        title: "Baue ein Haus",
        completed: true
    },
]

// Schritt 2 -> Routen anhand der Anforderungen überlegen

todos
    *   anzeigen       GET      /todos/all          alles todos anzeigen
    *   anlegen        POST     /todos/new        POST /todos
    *   ändern         PUT      /todos/update/:id
    *   löschen        DELETE   /todos/delete/:id
    
// Schritt 3 -> Route anlegen in nodejs/express (siehe oben)

// Schritt 4 -> Frontend aufzubauen...

*/