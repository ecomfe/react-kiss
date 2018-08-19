import {zipObject} from 'lodash';
import {compose} from 'recompose';
import joinAll from './joinAll';

export default regions => {
    const regionNames = Object.keys(regions);
    const regionValues = Object.values(regions);

    const establish = () => compose(...regionValues.map(region => region.establish()));

    const join = mapEmpireToProps => {
        const mapToProps = (...props) => {
            const regionProps = props.slice(0, -1);
            const ownProps = props[props.length - 1];
            const empireProps = zipObject(regionNames, regionProps);

            return mapEmpireToProps(empireProps, ownProps);
        };

        return joinAll(...regionValues.map(region => region.join), mapToProps);
    };

    return {establish, join};
};
