# react-kiss

[Redux](https://redux.js.org/) and [mobx-state-tree](https://github.com/mobxjs/mobx-state-tree) are both good state container solutions, however they introduces too many terminologies and bioperlates to structure a simple app.

We want something super simple and stupid, something that can define a state container everywhere at any granularity and combine them together to form a complete app. react-kiss is thus a state container which:

- introduces minimal efforts to create and use states.
- ships with both state and state transfer definitions, handles sync and async workflows naturally.
- allows split states to different parts as small as possible and combine then together when required.
- encourages establishing and joining state container in a smaller scope instead of a monotonous global state.

## Install

```shell
npm install react-kiss
```

## Region

A region is a container of a state and some workflows to manipulate state in the context of a given payload.

### State

A state is a predefined structure and its current data, any plain object can be a state.

### Workflow

A workflow is a process which receives a payload and manipulates current state, a workflow can manipulates state either synchronously or asychronously, it is also possible manipulates state multiple times within a workflow.

There are 2 forms of workflows.

#### Simple workflow

A simple workflow is a simple function that receives a payload and current state, it should return either a state patch like:

```javascript
const setCurrentUser = (user, state) => {
    if (state.currentUser) {
        return {};
    }

    return {
        currentUser: user
    };
};
```

or a state updater function like:

```javascript
const addValue = (amount, state) => {
    if (state.value >= 100) {
        return {};
    }

    return ({value}) => ({value: value + amount});
};
```

#### Composite workflow

A composite workflow is a workflow which may manipulates state multiple times or involves async process, it is defined as a generator function:

```javascript
function* saveTodo(todo) {
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
};
```

This generator function receives `(payload, getState)` as its arguments, and yields value in 3 types:

- a simple object is treated as a state patch.
- a function is treated as a state updater.
- a `Promise` instance is treated as an async process, its resolved value or rejected error will returned back to `yield` expression.

## Define a region

To define a region, we just need to provide an `initialState` and a map of `workflows` to `defineRegion` exported function:

```javascript
import {defineRegion} from 'react-kiss';

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

const todoRegion = defineRegion(initialState, workflows);

export const establishTodo = todoRegion.establish;
export const joinTodo = todoRegion.join;
```

The return value of `defineRegion` function is an object containing `establish` and `join` function.

## Establish a region

By `defineRegion` we get a region definition but it is not yet usable as a state container, we should establish it at a parent scope and join it from it's children.

To establish a region, call `establish` function returned by `defineRegion` like an HOC:

```jsx
import {establishTodo} from 'regions';

const Todo = () => (
    <div>
        <Filter />
        <List />
        <AddTodo />
    </div>
);

export default establishTodo('Todo')(Todo);
```

The only argument of `establish` function is an optional name of region, by enhancing a component with `establish`, it now acts as a context's `Provider` to manage the state.

Note a region can be established in different places, just like using `Provider` in different places, a child receives state from the closest regions of same type.

## Join a region

All children components under a component enhanced with `establish` can choose to join this region by invoking `join` function returned from `defineRegion`, in case a component is joined to a region, it automatically receives state and workflows from region, a `mapToProps` function is used to select props:

```jsx
import {PureComponent} from 'react';
import {bind} from 'lodash-decorators';
import {joinTodo} from 'regions';

class AddTodo extends PureComponent {

    state = {
        todoText: ''
    };

    @bind()
    syncTodoText(e) {
        this.setState({todoText: e.target.value});
    }

    @bind()
    async saveTodo() {
        const {todoText} = this.state;
        const {onSaveTodo} = this.props;

        await onSaveTodo(todoText);
        this.setState({todoText: ''});
    }

    componentDidUpdate(prevProps) {
        if (this.props.error !== prevProps.error) {
            alert(this.props.error.message); // eslint-disable-line no-alert
        }
    }

    render() {
        const {todoText} = this.state;
        const {submitting} = this.props;

        return (
            <div>
                <input value={todoText} onChange={this.syncTodoText} />
                <button type="button" onClick={this.saveTodo} disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Add Todo'}
                </button>
            </div>
        );
    }
}

const mapToProps = ({submitting, error, saveTodo}) => ({submitting, error, onSaveTodo: saveTodo});

export default joinTodo(mapToProps)(AddTodo);
```

This is very similar to react-redux's `connect` function except it only requires one `mapToProps` function.

## Combine regions

We can establish region at any place, it is also straightforward to establish multiple regions with different types:

```javascript
import {compose} from 'recompose';
import {establishTodo, establishNote} from 'regions';

const App = () => (
    // ...
);

const enhance = compose(
    establishTodo('MyTodo'),
    establishNote('Note')
);

export default ehnahce(App);
```

Note that it is **NOT** OK to establish multiple regions with the same type (returned from the same `defineRegion` call), in such case only the latest region takes effects.

We can also join multiple regions using the `joinAll` exported function:

```jsx
import {compose} from 'recompose';
import {joinAll} from 'react-kiss';
import {establishNote, joinNote, joinGlobal} from 'regions';

const Note = ({username, visible, message, onToggle}) => (
    <div style={{marginTop: 20}}>
        <button type="button" onClick={onToggle}>
            {visible ? 'Hide' : 'Show'}
        </button>
        {visible && <p style={{fontSize: 48, fontWeight: 'bold', textAlign: 'center'}}>{message} @ {username}</p>}
    </div>
);

const mapToProps = (note, global) => {
    const message = note.notes[global.username];

    return {
        username: global.username,
        message: message,
        visible: note.visible,
        onToggle: note.toggle
    };
};

const enhance = compose(
    establishNote('Note'),
    joinAll(joinNote, joinGlobal, mapToProps)
);

export default enhance(Note);
```

The `joinAll` function receives multiple `join` functions and a `mapToProps` function, the `mapToProps` function receives all region contexts in the order `join` functions are given.

## Transient region

In some cases we don't need a react's context to hold our state and workflows, the `withTransientRegion` HOC defines a region only for given component, it is a useful utility to separate state management from presetation.

```jsx
import {withTransientRegion} from 'react-kiss';

const initialState = {
    value: 0
};

const workflows = {
    increment(payload, {value}) {
        return {value: value + 1};
    },

    decrement(payload, {value}) {
        return {value: value - 1};
    }
};

// The Counter component now is a pure presentational function component, state and workflows are defined in region
const Counter = ({value, increment, decrement}) => (
    <div>
        <button type="button" onClick={decrement}>dec</button>
        <span>{value}</span>
        <button type="button" onClick={increment}>inc</button>
    </div>
);

export default withTransientRegion(initialState, workflows)(Counter);
```
