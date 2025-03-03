import { useApi } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

type TodoList = {
  id: number;
  createdAt: number;
  todoListName: string;
};

function App() {
  const api = useApi();
  const {
    isPending,
    error,
    data: todoLists,
  } = useQuery({
    queryKey: ["todolists"],
    queryFn: async () => {
      try {
        const response = await api.getTodoLists();
        return response.data;
      } catch (error) {
        console.error(error);
      }
      return null;
    },
  });

  if (isPending) return <h1>Loading...</h1>;
  if (error) return <h1>An error has occurred {error.message}</h1>;
  return (
    <>
      <h1>Todo lists</h1>
      <div className="flex flex-wrap justify-center mt-10">
        {(todoLists as TodoList[]).map((list: TodoList) => {
          return (
            <Link to={`/todos/${list.id}`} className="p-4 max-w-sm">
              <div className="p-5 max-w-sm rounded overflow-hidden shadow-lg">
                <h2>{list.todoListName}</h2>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export default App;
