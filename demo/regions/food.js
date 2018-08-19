import {defineEmpire, defineQueryRegion} from 'react-kiss';

const wait = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000));

const getMenu = async restaurantId => {
    await wait(~~(Math.random() * 3 + 1));

    const menu = restaurantId === '0'
    ? [
        'rice',
        'chicken',
        'dumpling'
    ]
    : [
        'pizza',
        'soup',
        'burger'
    ];

    return menu;
};

const getRestaurantList = async () => {
    await wait(~~(Math.random() * 3 + 1));

    return [
        {id: '0', name: 'Chai Wu'},
        {id: '1', name: 'The Araki'}
    ];
};

export default defineEmpire({
    menuQuery: defineQueryRegion(params => getMenu(params)),
    restaurantQuery: defineQueryRegion(() => getRestaurantList())
});
