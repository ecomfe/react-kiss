import defineRegion from '../defineRegion';

describe('defineRegion', () => {
    it('should exports establish/join pair', () => {
        const region = defineRegion({}, {}, {});
        const shape = {
            establish: expect.any(Function),
            join: expect.any(Function),
        };
        expect(region).toMatchObject(shape);
    });
});
