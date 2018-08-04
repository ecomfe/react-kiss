/**
 * @file 系统主入口
 * @author zhanglili
 */

import {establishGlobal} from 'regions';
import Todo from '../Todo';
import Note from '../Note';
import Counter from '../Counter';

const App = () => (
    <div>
        <Todo />
        <Note v={1} />
        <Counter />
    </div>
);

export default establishGlobal('App')(App);
