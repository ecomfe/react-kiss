import {establishTodo} from 'regions';
import Filter from './Filter';
import List from './List';
import AddTodo from './AddTodo';

const Todo = () => (
    <div>
        <Filter />
        <List />
        <AddTodo />
    </div>
);

export default establishTodo('Todo')(Todo);
