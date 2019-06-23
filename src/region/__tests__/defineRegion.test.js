import {mount} from 'enzyme';
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

    it('should exports establish as factory function to get a hoc with correct displayName', () => {
        const TestComponent = props => <div {...props}>TestComponent</div>;
        const region = defineRegion({}, {}, {});
        const {establish} = region;
        const hoc = establish('test');
        const ComponentOut = hoc(TestComponent);
        expect(ComponentOut.displayName).toBe('establish(Region(test))');
        const component = mount(<ComponentOut />);
        expect(component.find('div').text()).toBe('TestComponent');
    });

    it('should work with context correctly when function passed to join', () => {
        const contextText = 'test';

        const {establish, join} = defineRegion({a: contextText}, {}, {});
        const hoc = join(({a}) => {
            return {
                text: a,
            };
        });
        const TestComponent = ({text}) => <div>{text}</div>;
        const JoinComponent = hoc(TestComponent);
        const ComponentOut = establish()(JoinComponent);
        const component = mount(<ComponentOut />);
        expect(component.find('div').text()).toBe(contextText);
    });

    it('should work with context correctly when object passed to join', () => {
        const contextText = 'test';
        const {establish, join} = defineRegion({a: contextText}, {}, {});

        const hoc = join({
            text: 'a',
        });
        const TestComponent = ({text}) => <div>{text}</div>;
        const JoinComponent = hoc(TestComponent);
        const ComponentOut = establish()(JoinComponent);
        const component = mount(<ComponentOut />);
        expect(component.find('div').text()).toBe(contextText);
    });
});
