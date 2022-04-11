const TodoItem = (props) => {
    const updateTodoCompleted = () => {
        fetch("http://localhost:9000/todos/updateStatus", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: props.todo.id, completed: !props.todo.completed })
        }).then(response => response.json())
        .then((updatedTodos) => props.setTodos(updatedTodos))
    }

    const deleteTodo = () => {
        fetch("http://localhost:9000/todos/delete/" + props.todo.id, {
            method: "DELETE",
        })
        .then(response => response.json())
        .then((todosWithoutCurrentTodo) => props.setTodos(todosWithoutCurrentTodo))
    }

    return (
        <li 
            key={props.todo.id}
            className={props.todo.completed ? "completed" : ""}
        >
            <div
                onClick={updateTodoCompleted}
                className="todoitem"
            >
            {props.todo.title}
            </div>
            <div className="deleteTodo" onClick={deleteTodo} >
                ✘ 
            </div>
            
        </li>
    );
}
 
export default TodoItem;