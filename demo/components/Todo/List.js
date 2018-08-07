import {joinTodo} from 'regions';

/* eslint-disable react/no-array-index-key */
const TodoList = ({todos}) => (
    <ul>
        {todos.map((todo, i) => <li key={i}>{todo}</li>)}
    </ul>
);

const mapToProps = ({filterVisibleTodos}) => ({todos: filterVisibleTodos()});

export default joinTodo(mapToProps)(TodoList);
