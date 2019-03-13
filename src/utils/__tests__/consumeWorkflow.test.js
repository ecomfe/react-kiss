import consumeWorkflow from '../consumeWorkflow';

describe('consumeWorkflow', () => {
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

    const forward = jest.fn();

    const workflowGenerator = function* (payload, getState) {
        const state = getState();
        yield {
            ...state,
            ...payload,
        };
        forward();
    };

    const success = 'success';

    const error = 'error';

    const workflowGeneratorWithPromiseResolve = function* (payload, getState) {
        const state = getState();
        const result = yield Promise.resolve(success);
        forward(result);
    };

    const workflowGeneratorWithPromiseReject = function* (payload, getState) {
        const state = getState();
        const result = yield Promise.reject(error);
        forward(result);
    };

    const getState = () => oldState;

    const callback = jest.fn();

    const payload = {
        change: 'after',
        kiss: 'react',
    };

    it('should call the callback with the new state when the workflow is a normal function', () => {
        consumeWorkflow(workflowNormal, payload, getState, callback);

        expect(callback).toHaveBeenCalledWith(newState);
    });

    it('should call the callback with the new state when the workflow is a generator', async () => {
        await consumeWorkflow(workflowGenerator, payload, getState, callback);

        expect(callback).toHaveBeenCalledWith(newState);
    });

    it('should return brand new patched state when the workflow is a normal function', () => {
        const resultState = consumeWorkflow(workflowNormal, payload, getState, callback);

        expect(resultState).toEqual(newState);
        expect(resultState).not.toBe(newState);
    });

    it('should step forward after call the callback when the yields a non-promise value', async () => {
        await consumeWorkflow(workflowGenerator, payload, getState, callback);

        expect(forward).toHaveBeenCalled();
    });

    it('should step forward with resolved value when the workflow yields a resolved promise', async () => {
        await consumeWorkflow(workflowGeneratorWithPromiseResolve, payload, getState, callback);

        expect(forward).toHaveBeenCalledWith(success);
    });

    it('should throws when the workflow yields a rejected promise', async () => {
        await expect(
            consumeWorkflow(workflowGeneratorWithPromiseReject, payload, getState, callback)
        ).rejects.toEqual(error);
    });
});
