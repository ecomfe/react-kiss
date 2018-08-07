import {wrapDisplayName} from 'recompose';
import {createRegionComponent} from '../utils';

export const withTransientRegion = (initialState, workflows, selectors) => {
    const Region = createRegionComponent(initialState, workflows, selectors, 'TrasientRegion');

    return ComponentIn => {
        const ComponentOut = props => (
            <Region>
                {context => <ComponentIn {...context} {...props} />}
            </Region>
        );

        ComponentOut.displayName = wrapDisplayName(ComponentIn, 'withTransientRegion');

        return ComponentOut;
    };
};
