const endpoints = {
  getTodoLists: {
    url: "/",
    method: "GET",
  },
  createTodoList: {
    url: "/",
    method: "POST",
    data: {
      todoListName: "",
    },
  },
  deleteTodoList: {
    url: ({ id }: Record<string, unknown>) => `/${id}`,
    method: "DELETE",
  },

  getListTodos: {
    url: ({ id }: Record<string, unknown>) => `/${id}/todos`,
    method: "GET",
  },
  createTodo: {
    url: ({ id }: Record<string, unknown>) => `/${id}/todos`,
    method: "POST",
    data: {
      title: "",
      description: "",
      deadline: new Date(),
      completed: false,
    },
  },
  updateTodo: {
    url: ({ id, todoId }: Record<string, unknown>) => `/${id}/todos/${todoId}`,
    method: "PUT",
    data: {
      completed: false,
    },
  },
  deleteTodo: {
    url: ({ id, todoId }: Record<string, unknown>) => `/${id}/todos/${todoId}`,
    method: "DELETE",
  },
};

export default endpoints;
