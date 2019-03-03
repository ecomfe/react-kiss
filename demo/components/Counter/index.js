import {withTransientRegion} from 'react-kiss';

const initialState = {
    value: 0,
};

const workflows = {
    increment(payload, {value}) {
        return {value: value + 1};
    },

    decrement(payload, {value}) {
        return {value: value - 1};
    },
};

const Counter = ({value, increment, decrement}) => (
    <div>
        <button type="button" onClick={decrement}>dec</button>
        <span>{value}</span>
        <button type="button" onClick={increment}>inc</button>
    </div>
);

export default withTransientRegion(initialState, workflows)(Counter);
