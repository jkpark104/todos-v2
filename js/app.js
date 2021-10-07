let todos = [];

// main event
// const $mainEl = document.querySelector('main');

const $newTodo = document.querySelector('.new-todo');
const $toDoList = document.querySelector('.todo-list');

// id 생성 함수
const idGenerator = () => Math.max(...todos.map(todo => todo.id), 0) + 1;

// Todos 추가 함수
const addTodo = content =>
  setTodo([{ id: idGenerator(), content: content, completed: false }, ...todos]);

// setTodo 함수
const setTodo = newTodos => {
  todos = newTodos;
  render();
  counterRender();
};

// list render 함수
const render = () => {
  $toDoList.innerHTML = todos
    .map(
      ({ id, content, completed }) => `
    <li data-id="${id}">
      <div class="view">
        <input type="checkbox" class="toggle" ${completed ? 'checked' : ''} />
        <label>${content}</label>
        <button class="destroy"></button>
      </div>
      <input class="edit" value="${content}" />
    </li>`
    )
    .join('');
};

// counter render 함수
const counterRender = () => {
  document.querySelector('.todo-count').textContent = `
  ${todos.length} ${todos.length > 1 ? 'items' : 'item'} left`;
};

// 엔터 이벤트
$newTodo.onkeyup = e => {
  if (e.key !== 'Enter') return;
  if ($newTodo.value.trim() !== '') {
    addTodo($newTodo.value);
  }
  $newTodo.value = '';
};

// toggle-all 이벤트
const toggleAll = document.querySelector('.toggle-all');

toggleAll.onchange = () =>
  setTodo(todos.map(todo => ({ ...todo, completed: toggleAll.checked ? true : false })));

// toggle 이벤트
const $todoList = document.querySelector('.todo-list');

$todoList.onclick = ({ target }) => {
  if (!(target.matches('.toggle') || target.matches('.destroy'))) return;
  const targetId = target.parentNode.parentNode.dataset.id;
  target.matches('.toggle')
    ? setTodo(
        todos.map(todo => (todo.id === +targetId ? { ...todo, completed: !todo.completed } : todo))
      )
    : setTodo(todos.filter(todo => todo.id !== +targetId));
};

// editing event
$todoList.ondblclick = ({ target }) => {
  if (
    !(
      target.matches('.todo-list label') ||
      (target.matches('.todo-list .edit') && target.value.trim() !== '')
    )
  )
    return;
  const targetId = target.matches('.todo-list label')
    ? target.parentNode.parentNode.dataset.id
    : target.parentNode.dataset.id;
  [...document.querySelectorAll('.todo-list li')].forEach(todoItem => {
    if (todoItem.dataset.id === targetId)
      target.matches('.todo-list label')
        ? todoItem.classList.add('editing')
        : todoItem.classList.remove('editing');
  });
  if (target.matches('.todo-list .edit'))
    setTodo(
      todos.map(todo => (todo.id === +targetId ? { ...todo, content: target.value.trim() } : todo))
    );
};

//// Enter
$todoList.onkeyup = e => {
  if (e.key !== 'Enter' || !e.target.matches('.todo-list .edit')) return;
  if (e.target.value.trim() === '') return;

  const targetId = e.target.parentNode.dataset.id;
  setTodo(
    todos.map(todo => (todo.id === +targetId ? { ...todo, content: e.target.value.trim() } : todo))
  );
};
