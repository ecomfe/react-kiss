import {Component} from 'react';
import {mapValues} from 'lodash';
import consumeWorkflow from './consumeWorkflow';

export default (initialState, workflows, displayName) => class extends Component {

    static displayName = displayName;

    state = initialState;

    workflows = null;

    constructor(props) {
        super(props);

        const getState = () => this.state;
        const applyNext = this.setState.bind(this);
        const linkWorkflowToState = workflow => {
            return payload => consumeWorkflow(workflow, payload, getState, applyNext);
        };
        this.workflows = mapValues(workflows, linkWorkflowToState);
    }

    render() {
        const {children} = this.props;
        const context = {...this.state, ...this.workflows};

        return children(context);
    }
};
