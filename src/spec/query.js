import stringify from 'json-stable-stringify';
import {get} from 'lodash';
import {defineRegion} from '../region';

export default (api, {once = false} = {}) => {
    const initialState = {
        queries: {}
    };

    const workflows = {
        * request(params, getState) {
            const paramsKey = stringify(params);
            const transfer = patch => state => {
                const query = state.queries[paramsKey];
                const queryPatch = typeof patch === 'function' ? patch(query) : patch;

                return {
                    queries: {
                        ...state.queries,
                        [paramsKey]: {
                            ...query,
                            ...queryPatch
                        }
                    }
                };
            };

            const stateBeforeRequest = getState();
            if (!stateBeforeRequest.queries[paramsKey]) {
                yield transfer({params, pendingMutex: 0, response: undefined});
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

    const findQuery = ({queries}, params) => queries[stringify(params)];
    const findResponse = (state, params) => {
        const query = findQuery(state, params);
        return query && query.response;
    };
    const findData = (state, params) => {
        const response = findResponse(state, params);
        return response && response.data;
    };
    const selectors = {findQuery, findResponse, findData};

    return defineRegion(initialState, workflows, selectors);
};
