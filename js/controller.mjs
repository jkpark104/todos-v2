import todos from './model.mjs';
import render from './view.mjs';

// DOM Nodes
const $newTodo = document.querySelector('.new-todo');
const $toggleAll = document.querySelector('.toggle-all');
const $todoList = document.querySelector('.todo-list');
const $filters = document.querySelector('.filters');
const $clearCompleted = document.querySelector('.clear-completed');

// state function
const changeStateWith = newTodos => {
  todos.setTodos(newTodos);
  render(todos.state, todos.currentFilter);
};

const changeFilterWith = newFilter => {
  todos.setFilter(newFilter);
  render(todos.state, todos.currentFilter);
};

const fetchTodos = () => {
  changeStateWith([
    { id: 3, content: 'JavaScript', completed: false },
    { id: 2, content: 'CSS', completed: true },
    { id: 1, content: 'HTML', completed: false }
  ]);
};

const generateTodoId = () =>
  Math.max(...todos.state.map(todo => todo.id), 0) + 1;

const addTodo = content => {
  changeStateWith([
    { id: generateTodoId(), content, completed: false },
    ...todos.state
  ]);
};

const toggleTodoCompleted = id => {
  changeStateWith(
    todos.state.map(todo =>
      todo.id === +id ? { ...todo, completed: !todo.completed } : todo
    )
  );
};

const toggleAllTodosCompleted = completed => {
  changeStateWith(todos.state.map(todo => ({ ...todo, completed })));
};

const updateTodoContent = (id, content) => {
  changeStateWith(
    todos.state.map(todo => (todo.id === +id ? { ...todo, content } : todo))
  );
};

const removeTodo = id => {
  changeStateWith(todos.state.filter(todo => todo.id !== +id));
};

const removeAllCompletedTodos = () => {
  changeStateWith(todos.state.filter(todo => !todo.completed));
};

// Event bindings
window.addEventListener('DOMContentLoaded', fetchTodos);

$newTodo.onkeyup = e => {
  if (e.key !== 'Enter') return;

  const content = $newTodo.value.trim();
  if (content) addTodo(content);

  $newTodo.value = '';
};

$todoList.onchange = e => {
  if (!e.target.classList.contains('toggle')) return;

  const { id } = e.target.closest('li').dataset; // 요소가 추가돼도 코드를 안 바꿔도 됨
  toggleTodoCompleted(id);
};

$toggleAll.onchange = () => {
  toggleAllTodosCompleted($toggleAll.checked);
};

$todoList.ondblclick = e => {
  if (!e.target.matches('.view > label')) return;
  e.target.closest('li').classList.add('editing');
};

$todoList.onkeyup = e => {
  if (e.key !== 'Enter') return;
  updateTodoContent(e.target.parentNode.dataset.id, e.target.value);
};

$todoList.onclick = e => {
  if (!e.target.classList.contains('destroy')) return;
  removeTodo(e.target.closest('li').dataset.id);
};

$filters.onclick = e => {
  if (!e.target.matches('.filters > li > a')) return;

  [...$filters.querySelectorAll('a')].forEach($a => {
    $a.classList.toggle('selected', $a === e.target);
  });

  changeFilterWith(e.target.id);
};

$clearCompleted.onclick = removeAllCompletedTodos;
