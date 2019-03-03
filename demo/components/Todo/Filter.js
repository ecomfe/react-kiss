import {joinTodo} from '@/regions';

/* eslint-disable react/jsx-no-bind */
const TodoFilter = ({filter, onFilter}) => (
    <div>
        <input value={filter} onChange={e => onFilter(e.target.value)} placeholder="Search Todo" />
    </div>
);

const mapToProps = {
    filter: 'filter',
    onFilter: 'filterByKeyword',
};

export default joinTodo(mapToProps)(TodoFilter);
