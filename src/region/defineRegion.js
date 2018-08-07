import {createContext} from 'react';
import {mapValues} from 'lodash';
import {wrapDisplayName} from 'recompose';
import {createRegionComponent} from '../utils';

export default (initialState, workflows, selectors) => {
    const {Provider, Consumer} = createContext();

    const establish = name => {
        const displayName = `Region(${name || 'Unknown'})`;
        const Region = createRegionComponent(initialState, workflows, selectors, displayName);

        return ComponentIn => {
            const ComponentOut = props => (
                <Region>
                    {
                        context => (
                            <Provider value={context}>
                                <ComponentIn {...props} />
                            </Provider>
                        )
                    }
                </Region>
            );

            ComponentOut.displayName = `establish(${displayName})`;

            return ComponentOut;
        };
    };

    const join = mapToProps => {
        const selectContext = typeof mapToProps === 'function'
            ? mapToProps
            : context => mapValues(mapToProps, name => context[name]);

        return ComponentIn => {
            const ComponentOut = props => (
                <Consumer>
                    {
                        context => {
                            const propsFromContext = selectContext(context, props);

                            return <ComponentIn {...props} {...propsFromContext} />;
                        }
                    }
                </Consumer>
            );

            ComponentOut.displayName = wrapDisplayName(ComponentIn, 'join');

            return ComponentOut;
        };

    };

    return {establish, join};
};
