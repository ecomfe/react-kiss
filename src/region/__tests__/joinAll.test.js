import * as recompose from 'recompose';
import joinAll from '../joinAll';

describe('joinAll', () => {
    let joinMockFn01 = null;
    let joinMockFn02 = null;
    let mapToPropsMockFn = null;
    let mapPropsSpy = recompose.mapProps;

    beforeEach(() => {
        joinMockFn01 = jest.fn();
        joinMockFn02 = jest.fn();
        mapToPropsMockFn = jest.fn(() => ({value: 'test'}));
        mapPropsSpy = jest.spyOn(recompose, 'mapProps');
    });

    afterEach(() => {
        joinMockFn01 = null;
        joinMockFn02 = null;
        mapToPropsMockFn = null;
        mapPropsSpy = recompose.mapProps;
    });

    it('should return function', () => {
        const result = joinAll(joinMockFn01, joinMockFn02, mapToPropsMockFn);
        expect(typeof result).toBe('function');
    });

    it('should call all join methond passed as parameters', () => {
        joinAll(joinMockFn01, joinMockFn02, mapToPropsMockFn);
        expect(joinMockFn01).toHaveBeenCalled();
        expect(joinMockFn02).toHaveBeenCalled();
        expect(mapPropsSpy).toHaveBeenCalled();
    });

    it('shoudl return correct object when call join parameter', () => {
        joinAll(joinMockFn01, joinMockFn02, mapToPropsMockFn);
        const callback = joinMockFn01.mock.calls[0][0];
        const result = callback('test');
        expect(result).toEqual({$join$0$: 'test'});
    });

    it('should return correct props when call mapProps parameter', () => {
        joinAll(joinMockFn01, joinMockFn02, mapToPropsMockFn);

        const regionMethod = mapPropsSpy.mock.calls[0][0];
        const result = regionMethod({$join$0$: 'join1', $join$1$: 'join2', text: 'test'});

        expect(result).toEqual({value: 'test', text: 'test'});
    });
});
