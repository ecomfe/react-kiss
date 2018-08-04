import {joinTodo} from 'regions';

/* eslint-disable react/no-array-index-key */
const TodoList = ({filter, todos}) => {
    const filteredTodos = filter ? todos.filter(text => text.includes(filter)) : todos;

    return (
        <ul>
            {filteredTodos.map((todo, i) => <li key={i}>{todo}</li>)}
        </ul>
    );
};

const mapToProps = {
    todos: 'todos',
    filter: 'filter'
};

export default joinTodo(mapToProps)(TodoList);
