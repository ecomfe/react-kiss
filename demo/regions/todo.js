import {defineRegion} from 'react-kiss';

const wait = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000));

const postTodo = async text => {
    await wait(3);

    if (text.includes('fuck')) {
        throw new Error('Sensitive words found');
    }

    return text;
};

const initialState = {
    todos: [
        'Buy milk',
        'Meet John at peace park'
    ],
    filter: '',
    error: null,
    submitting: false
};

const workflows = {
    * saveTodo(todo) {
        yield {submitting: true};
        try {
            const newTodo = yield postTodo(todo);
            yield state => {
                const {todos} = state;

                return {
                    todos: [...todos, newTodo],
                    submitting: false
                };
            };
        }
        catch (ex) {
            yield {submitting: false, error: ex};
        }
    },

    filterByKeyword(keyword) {
        return {filter: keyword};
    }
};

const selectors = {
    filterVisibleTodos({todos, filter}) {
        return filter ? todos.filter(todo => todo.includes(filter)) : todos;
    }
};

export default defineRegion(initialState, workflows, selectors);
