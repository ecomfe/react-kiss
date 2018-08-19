import {each} from 'lodash';
import {compose} from 'recompose';
import joinAll from './joinAll';

export default regions => {
    const regionNameList = [];
    const joinList = [];
    const establishList = [];

    each(regions, (region, name) => {
        const {join, establish} = region;
        regionNameList.push(name);
        joinList.push(join);
        establishList.push(establish(name));
    });

    const establish = () => compose(...establishList);

    const join = mapEmpireToProps => {
        const mapToProps = (...props) => {
            const regionPropsList = props.slice(0, -1);
            const ownProps = props[props.length - 1];

            const empireProps = {};
            each(regionNameList, (name, i) => {
                empireProps[name] = regionPropsList[i];
            });

            return mapEmpireToProps(empireProps, ownProps);
        };

        return joinAll(...joinList, mapToProps);
    };

    return {establish, join};
};
