import TodoItem from "./TodoItem";

const TodoList = (props) => {
    return ( 
        <div>
            <h3>Todos:</h3>
            <ul>
                { props.todos.map(todo => <TodoItem todo={todo} setTodos={props.setTodos} key={todo.id} />) }
            </ul>
        </div>
     );
}
 
export default TodoList;