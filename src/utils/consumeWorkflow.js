import isGeneratorFunction from 'is-generator-fn';
import isPromise from 'is-promise';

const consumeAsGeneratorFunction = async (workflow, payload, getState, callback) => {
    const generator = workflow(payload, getState);
    let next = generator.next();

    while (!next.done) {
        const yieldValue = next.value;

        if (isPromise(yieldValue)) {
            try {
                const result = await yieldValue;
                next = generator.next(result);
            }
            catch (ex) {
                next = generator.throw(ex);
            }
        }
        else {
            callback(yieldValue);
            next = generator.next();
        }
    }

    return next.value;
};

export default (workflow, payload, getState, callback) => {
    if (isGeneratorFunction(workflow)) {
        return consumeAsGeneratorFunction(workflow, payload, getState, callback);
    }
    else {
        const currentState = getState();
        const statePatch = workflow(payload, currentState);
        callback(statePatch);
        return statePatch;
    }
};
