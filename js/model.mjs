const todos = {
  state: [],

  currentFilter: 'all',

  setTodos(newTodos) {
    if (!newTodos) return;
    this.state = newTodos;
  },

  setFilter(newFilter) {
    if (!newFilter) return;
    this.currentFilter = newFilter;
  }
};

export default todos;
