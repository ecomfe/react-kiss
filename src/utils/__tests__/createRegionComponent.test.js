import {shallow, mount} from 'enzyme';
import {mapValues, partial, identity} from 'lodash/fp';
import createRegionComponent from '../createRegionComponent';

const consumeWorkflow = jest.mock('../consumeWorkflow');

describe('createRegionComponent', () => {
    const oldState = {
        hello: 'world',
        change: 'before',
    };

    const newState = {
        hello: 'world',
        change: 'after',
        kiss: 'react',
    };

    const workflowNormal = (payload, state) => {
        return {
            ...state,
            ...payload,
        };
    };

    const workflows = {
        normal: workflowNormal,
    };

    const displayName = 'Region(Test)';

    const selectors = {
        selectAll: ({hello, change, kiss}) => {
            return [hello, change, kiss].join(',');
        }
    };

    it('should create a component with correct displayName', () => {
        const Region = createRegionComponent(oldState, workflows, selectors, displayName);
        expect(Region.displayName).toBe(displayName);
    });

    it('should throws TypeError when the children is not a function', () => {
        const Region = createRegionComponent(oldState, workflows, selectors, displayName);
        expect(
            () => shallow(<Region environment="environment" other="other" />)
        ).toThrowError(new TypeError('children is not a function'));
    })

    it('should call the children with enhanced arguments, which composed with the state, workflows and selectors', () => {
        const Region = createRegionComponent(oldState, workflows, selectors, displayName);

        const children = jest.fn();

        const environment = {hello: 'world'};

        const wrapper = shallow(
            <Region environment={environment} other="other">
                {children}
            </Region>
        );

        const wrappedWorkflows = mapValues(v => () => null, workflows);
        const wrappedSelectors = mapValues(v => () => null, selectors);

        expect(children).toHaveBeenCalledWith(
            expect.objectContaining({
                ...oldState,
                ...mapValues(o => expect.any(Function), wrappedWorkflows),
                ...mapValues(o => expect.any(Function), wrappedSelectors),
            })
        );
    });

    it('should be able to calculate the initial state along with the environment by function', () => {
        const fnInitialState = jest.fn(props => ({
            ...props,
            kiss: 'react',
        }));

        const Region = createRegionComponent(fnInitialState, workflows, selectors, displayName);

        const environment = {hello: 'world'};
        const children = jest.fn();

        const wrapper = shallow(
            <Region environment={environment} other="other">
                {children}
            </Region>
        );

        const wrappedWorkflows = mapValues(v => () => null, workflows);
        const wrappedSelectors = mapValues(v => () => null, selectors);

        expect(fnInitialState).toHaveBeenCalledWith(environment);
        expect(children).toHaveBeenCalledWith(
            expect.objectContaining({
                hello: 'world',
                kiss: 'react',
                ...mapValues(o => expect.any(Function), wrappedWorkflows),
                ...mapValues(o => expect.any(Function), wrappedSelectors),
            })
        );
    });
});
