import defineEmpire from '../defineEmpire';
import joinAll from '../joinAll';

jest.mock('../joinAll');

describe('defineEmpire', () => {
    let establishMockFunc = null;
    let joinMockFunc = null;
    let regions = null;

    beforeEach(() => {
        joinAll.mockReset();
        establishMockFunc = jest.fn();
        joinMockFunc = jest.fn();
        regions = {
            a: {
                establish: establishMockFunc,
                join: joinMockFunc,
            },
            b: {
                establish: establishMockFunc,
                join: joinMockFunc,
            },
        };
    });

    afterEach(() => {
        establishMockFunc = null;
        joinMockFunc = null;
        regions = null;
    });

    it('should call all establish method in regions when call exported establish method', () => {
        const {establish} = defineEmpire(regions);
        establish();
        expect(establishMockFunc.mock.calls.length).toBe(2);
    });

    it('should call joinAll when call exported join method', () => {
        const mapEmpireToPropsMockFn = jest.fn();
        const {join} = defineEmpire(regions);
        join(mapEmpireToPropsMockFn);
        expect(joinAll).toHaveBeenCalled();

        joinAll.mock.calls[0][0]();
        joinAll.mock.calls[0][1]();
        joinAll.mock.calls[0][2]();
        expect(joinMockFunc.mock.calls.length).toBe(2);
    });

});
