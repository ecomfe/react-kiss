import {wrapDisplayName} from 'recompose';
import {createRegionComponent} from '../utils';

export const withTransientRegion = (initialState, workflows) => {
    const Region = createRegionComponent(initialState, workflows, 'TrasientRegion');

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
