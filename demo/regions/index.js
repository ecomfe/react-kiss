import global from './global';
import todo from './todo';
import note from './note';
import food from './food';

export const establishGlobal = global.establish;
export const joinGlobal = global.join;

export const establishTodo = todo.establish;
export const joinTodo = todo.join;

export const establishNote = note.establish;
export const joinNote = note.join;

export const establishFood = food.establish;
export const joinFood = food.join;
