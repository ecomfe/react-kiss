import stringify from 'json-stable-stringify';
import {get} from 'lodash';
import {defineRegion} from '../region';

export default (api, {once = false} = {}) => {
    const initialState = {};

    const workflows = {
        * request(params, getState) {
            const paramsKey = stringify(params);
            const transfer = patch => state => {
                const query = state[paramsKey];
                const queryPatch = typeof patch === 'function' ? patch(query) : patch;

                return {
                    [paramsKey]: {
                        ...query,
                        ...queryPatch
                    }
                };
            };

            if (!getState()[paramsKey]) {
                yield {
                    [paramsKey]: {
                        params,
                        pendingMutex: 0,
                        response: null
                    }
                };
            }

            const previousResponseData = get(getState(), [paramsKey, 'response', 'data']);
            if (once && previousResponseData) {
                return previousResponseData;
            }

            yield transfer(query => ({pendingMutex: query.pendingMutex + 1}));

            try {
                const data = yield api(params);
                yield transfer({response: {data}});
                return data;
            }
            catch (error) {
                yield transfer({response: {error}});
                throw error;
            }
            finally {
                yield transfer(query => ({pendingMutex: query.pendingMutex - 1}));
            }
        }
    };

    return defineRegion(initialState, workflows);
};
