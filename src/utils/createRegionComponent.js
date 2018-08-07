import {Component} from 'react';
import {mapValues, partial} from 'lodash';
import consumeWorkflow from './consumeWorkflow';

const applyStateChange = (state, stateChange) => {
    const patch = typeof stateChange === 'function' ? stateChange(state) : stateChange;
    return {...state, ...patch};
};

export default (initialState, workflows, selectors, displayName) => class extends Component {

    static displayName = displayName;

    state = initialState;

    // Since `setState` doesn't guarantee synchronously update of state,
    // we need to manage a state to ensure `getState` function returns correct state object
    stateInSync = initialState;

    workflows = null;

    constructor(props) {
        super(props);

        const getState = () => this.stateInSync;
        const applyNext = stateChange => {
            this.stateInSync = applyStateChange(this.stateInSync, stateChange);
            this.setState(this.stateInSync);
        };
        const linkWorkflowToState = workflow => {
            return payload => consumeWorkflow(workflow, payload, getState, applyNext);
        };
        this.workflows = mapValues(workflows, linkWorkflowToState);
    }

    render() {
        const {children} = this.props;
        const boundSelectors = mapValues(
            selectors,
            selector => partial(selector, this.state)
        );
        const context = {...this.state, ...this.workflows, ...boundSelectors};

        return children(context);
    }
};
