// MODEL

let todos = [];

const generateToDoId = () => Math.max(...todos.map(todo => todo.id), 0) + 1;
const setToDos = newTodos => (todos = newTodos);

// MODEL

// VIEW

const render = todos => {
  document.querySelector('.todo-list').innerHTML = todos
    .map(
      ({ id, content, completed, isEditing }) => `
    <li data-id="${id}"${isEditing ? ' class="editing"' : ''}>
      <div class="view">
        <input type="checkbox" class="toggle" ${completed ? 'checked' : ''} />
        <label>${content}</label>
        <button class="destroy"></button>
      </div>
      <input class="edit" value="${content}" />
    </li>`
    )
    .join('');

  document.querySelector('.todo-count').textContent = `
  ${todos.length} ${todos.length > 1 ? 'items' : 'item'} left`;

  showClearcompleted();
  showFooter();
};

// VIEW

// CONTROLLER

const addTodo = content => {
  setToDos([
    { id: generateToDoId(), content: content, completed: false, isEditing: false },
    ...todos,
  ]);
  render(todos);
  showClearcompleted();
};

const removeTodo = id => {
  setToDos(todos.filter(todo => todo.id !== id));
  render(todos);
  showClearcompleted();
};

const removeTodos = todos => {
  setToDos(todos);
  render(todos);
  showClearcompleted();
};

const editMode = id => {
  setToDos(todos.map(todo => (todo.id === id ? { ...todo, isEditing: true } : todo)));
  render(todos);
};

const editTodo = (id, content) => {
  setToDos(
    todos.map(todo => (todo.id === id ? { ...todo, content: content, isEditing: false } : todo))
  );
  render(todos);
};

const checkTodo = (...id) => {
  id.length
    ? setToDos(
        todos.map(todo => (todo.id === id[0] ? { ...todo, completed: !todo.completed } : todo))
      )
    : setToDos(todos.map(todo => ({ ...todo, completed: $toggleAll.checked ? true : false })));
  render(todos);
  showClearcompleted();
};

const showClearcompleted = () => {
  const $clearCompleted = document.querySelector('.clear-completed');
  todos.filter(todo => todo.completed).length
    ? $clearCompleted.classList.remove('hidden')
    : $clearCompleted.classList.add('hidden');
};

const showFooter = () => {
  const $main = document.querySelector('.main');
  const $footer = document.querySelector('.footer');
  todos.length ? $main.classList.remove('hidden') : $main.classList.add('hidden');
  todos.length ? $footer.classList.remove('hidden') : $footer.classList.add('hidden');
};

//------------------------ 이벤트
const $newToDo = document.querySelector('.new-todo');
$newToDo.onkeyup = e => {
  if (e.key !== 'Enter') return;
  if ($newToDo.value.trim() !== '') {
    addTodo($newToDo.value);
  }
  $newToDo.value = '';
};

const $toggleAll = document.querySelector('.toggle-all');
$toggleAll.onchange = () => checkTodo();

const $todoList = document.querySelector('.todo-list');
$todoList.onclick = ({ target }) => {
  if (!(target.matches('.toggle') || target.matches('.destroy'))) return;

  const targetId = target.parentNode.parentNode.dataset.id;
  target.matches('.toggle') ? checkTodo(+targetId) : removeTodo(+targetId);
};

$todoList.addEventListener('dblclick', ({ target }) => {
  if (!target.matches('.todo-list label')) return;

  const targetId = target.parentNode.parentNode.dataset.id;
  editMode(+targetId);
});

$todoList.addEventListener('dblclick', ({ target }) => {
  if (!target.matches('.todo-list .edit') || target.value.trim() === '') return;

  const targetId = target.parentNode.dataset.id;
  editTodo(+targetId, target.value.trim());
});

$todoList.onkeyup = e => {
  if (e.key !== 'Enter' || !e.target.matches('.todo-list .edit')) return;
  if (e.target.value.trim() === '') return;

  const targetId = e.target.parentNode.dataset.id;
  editTodo(+targetId, e.target.value.trim());
};

const $filters = document.querySelector('.filters');
$filters.onclick = ({ target }) => {
  [...document.querySelectorAll('.filters a')].forEach(filtersItem => {
    filtersItem === target
      ? filtersItem.classList.add('selected')
      : filtersItem.classList.remove('selected');
  });

  target.id === 'all'
    ? render(todos)
    : target.id === 'active'
    ? render(todos.filter(todo => !todo.completed))
    : render(todos.filter(todo => todo.completed));
};

const $clearCompleted = document.querySelector('.clear-completed');
$clearCompleted.onclick = () => removeTodos(todos.filter(todo => !todo.completed));

window.addEventListener('DOMContentLoaded', () => {
  render(todos);
});

// CONTROLLER
