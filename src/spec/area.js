import {each} from 'lodash';
import {compose} from 'recompose';
import joinAll from '../region/joinAll';

export default queryRegions => {
    const queryNameList = [];
    const joinList = [];
    const establishList = [];

    each(queryRegions, (region, queryName) => {
        const {join, establish} = region;
        queryNameList.push(queryName);
        joinList.push(join);
        establishList.push(establish(queryName));
    });

    const establish = () => compose(...establishList);

    const join = mapAreaToProps => {
        const mapToProps = (...props) => {
            const regionPropsList = props.slice(0, -1);
            const ownProps = props[props.length - 1];

            const areaProps = {};
            each(queryNameList, (name, i) => {
                areaProps[name] = regionPropsList[i];
            });

            return mapAreaToProps(areaProps, ownProps);
        };

        return joinAll(...joinList, mapToProps);
    };

    return {establish, join};
};
