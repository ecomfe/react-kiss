import {omit} from 'lodash';
import {compose, mapProps} from 'recompose';

export default (...args) => {
    const joins = args.slice(0, -1);
    const mapToProps = args[args.length - 1];

    const [keys, hocs] = joins.reduce(
        ([keys, hocs], join, i) => {
            const key = '$join$' + i + '$';
            const hoc = join(context => ({[key]: context}));

            keys.push(key);
            hocs.push(hoc);

            return [keys, hocs];
        },
        [[], []]
    );
    const removeRegionProps = props => omit(props, keys);

    const rejoin = props => {
        const regionProps = keys.map(key => props[key]);
        const otherProps = removeRegionProps(props);

        return {
            ...mapToProps(...regionProps, otherProps),
            ...otherProps,
        };
    };

    return compose(
        ...hocs,
        mapProps(rejoin)
    );
};
