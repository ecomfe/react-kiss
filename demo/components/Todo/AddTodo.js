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
