import React, {Component, Fragment} from 'react';
import {compose} from 'recompose';
import {establishFood, joinFood} from 'regions';
import {map, each, keys} from 'lodash';

class Food extends Component {

    componentDidMount() {
        const {requestRestaurantList, requestMenu} = this.props;

        requestRestaurantList().then(res => {
            const restaurantIds = keys(res);

            each(restaurantIds, id => {
                requestMenu(id);
            });
        });
    }

    render() {
        const {restaurantList, selectMenuData} = this.props;

        if (!restaurantList.length) {
            return <span>searching restaurants...</span>
        }

        return (
            <div>
                {map(restaurantList, ({name, id}) => (
                    <Fragment key={name}>
                        <span>restaurant: {name}</span>
                        <ul>
                            {selectMenuData(id)
                                ? map(selectMenuData(id), (item, j) => (
                                    <li key={j}>{item}</li>
                                ))
                                : 'loading menu...'
                            }
                        </ul>
                    </Fragment>
                ))}
            </div>
        );
    }
}

const mapToProps = (areaProps, ownProps) => {
    const {menuQuery, restaurantQuery} = areaProps;
    const restaurantList = restaurantQuery.findData() || [];

    return {
        restaurantList,
        selectMenuData: menuQuery.findData,
        requestMenu: menuQuery.request,
        requestRestaurantList: restaurantQuery.request,
        ...ownProps
    };
};

const enhance = compose(
    establishFood(),
    joinFood(mapToProps)
);

export default enhance(Food);
