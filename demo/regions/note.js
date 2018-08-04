import {defineRegion} from 'react-kiss';

const initialState = {
    visible: true,
    notes: {
        otakustay: 'Life is simple'
    }
};

const workflows = {
    toggle(payload, {visible}) {
        return {visible: !visible};
    }
};

export default defineRegion(initialState, workflows);
