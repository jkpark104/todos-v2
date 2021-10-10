// DOM Nodes
const $main = document.querySelector('.main');
const $todoList = document.querySelector('.todo-list');
const $footer = document.querySelector('.footer');
const $todoCount = document.querySelector('.todo-count');
const $clearCompleted = document.querySelector('.clear-completed');

// state function
// TODO: innerHTML의 렌더 방식 변경해야 함
const render = (todos, currentFilter) => {
  const _todos = todos.filter(todo =>
    currentFilter === 'completed'
      ? todo.completed
      : currentFilter === 'active'
      ? !todo.completed
      : true
  );

  $todoList.innerHTML = _todos
    .map(
      ({ id, content, completed }) => `
       <li data-id="${id}">
         <div class="view">
           <input type="checkbox" class="toggle" ${
             completed ? 'checked' : ''
           } />
           <label>${content}</label>
           <button class="destroy"></button>
         </div>
         <input class="edit" value="${content}" />
       </li>`
    )
    .join('');

  [$main, $footer].forEach($el =>
    $el.classList.toggle('hidden', todos.length === 0)
  );

  const activeTodos = todos.filter(todo => !todo.completed);

  $todoCount.textContent = `
    ${activeTodos.length} ${activeTodos.length > 1 ? 'items' : 'item'} left`;

  const completedTodos = todos.filter(todo => todo.completed);

  $clearCompleted.classList.toggle('hidden', completedTodos.length === 0);
};

export default render;
