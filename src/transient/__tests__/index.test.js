import {mount} from 'enzyme';
import {withTransientRegion} from '../index';

describe('withTransientRegion', () => {
    it('should exports as a hoc', () => {
        const hoc = withTransientRegion({}, {}, {});
        expect(typeof hoc).toBe('function');
    });

    it('should render component with correct displayName', () => {
        const TestComponent = props => <div {...props}>TestComponent</div>;
        const ComponentOut = withTransientRegion({}, {}, {})(TestComponent);
        expect(ComponentOut.displayName).toBe('withTransientRegion(TestComponent)');
    });

    it('should work with context correctly', () => {
        const contextText = 'test';
        const TestComponent = ({text}) => <div>{text}</div>;

        const ComponentOut = withTransientRegion({text: contextText}, {}, {})(TestComponent);
        const component = mount(<ComponentOut />);
        expect(component.find('div').text()).toBe(contextText);
    });
});
