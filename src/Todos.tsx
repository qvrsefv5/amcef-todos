import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useParams } from "react-router";
import "./App.css";
import { useApi } from "./api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "./main";

type Todo = {
  title: string;
  description: string;
  deadline: Date;
  completed?: boolean;
};

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  // deadline: z.coerce.date(),
  // deadline: z.string().datetime().pipe(z.coerce.date()),
  deadline: z.coerce
    .string()
    .datetime({ local: true })
    .transform((t) => new Date(t)),
});

function Todos() {
  const params = useParams();

  const api = useApi();
  const {
    isPending,
    error,
    data: todos,
  } = useQuery({
    queryKey: ["todos", Number(params.id)],
    queryFn: async () => {
      try {
        const response = await api.getListTodos({
          urlParams: {
            id: params.id,
          },
        });
        return response.data;
      } catch (error) {
        console.error(error);
      }
      return null;
    },
  });

  const createTodo = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Todo }) => {
      const response = await api.createTodo({
        urlParams: { id },
        data: {
          ...data,
          deadline: new Date(data.deadline).getTime(),
          completed: false,
        },
      });

      if (response?.status !== 200) {
        return {};
      }

      return response?.data;
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", Number(params.id)] });
    },
  });
  const deleteTodo = useMutation({
    mutationFn: async ({ id, todoId }: { id: number; todoId: number }) => {
      const response = await api.deleteTodo({
        urlParams: { id, todoId },
      });

      if (response?.status !== 200) {
        return {};
      }

      return response?.data;
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", Number(params.id)] });
    },
  });
  const updateTodo = useMutation({
    mutationFn: async ({
      id,
      todoId,
      data,
    }: {
      id: number;
      todoId: number;
      data: Partial<Todo>;
    }) => {
      const response = await api.updateTodo({
        urlParams: { id, todoId },
        data: { ...data },
      });

      if (response?.status !== 200) {
        return {};
      }

      return response?.data;
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", Number(params.id)] });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Todo>({
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<Todo> = (data: z.infer<typeof schema>) => {
    console.log(data);
    console.log(data.deadline.getDate());
    createTodo.mutate({ id: Number(params.id), data });
  };

  return (
    <>
      <div className="flex items-center flex-col">
        <h1 className="">add todo</h1>

        <form className="flex w-1/3 flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              id="title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Title"
              {...register("title", { required: true })}
            />
            {errors.title && (
              <span className="text-error">{errors.title.message}</span>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              placeholder="description text"
              id="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register("description", { required: true })}
            />
            {errors.description && (
              <span className="text-error">{errors.description.message}</span>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Deadline
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="datetime-local"
              placeholder="deadline"
              defaultValue={moment(new Date().toISOString()).format(
                "YYYY-MM-DD[T]00:00:01"
              )}
              step={1}
              {...register("deadline", { required: true })}
            />
            {errors.deadline && (
              <span className="text-error">{errors.deadline.message}</span>
            )}
          </div>

          <button type="submit" disabled={createTodo.isPending}>
            Submit
          </button>
        </form>
      </div>
      <div className="flex items-center flex-col">
        {error && <h1>An error has occurred {error.message}</h1>}
        {isPending && <h1>Loading...</h1>}
        {todos &&
          todos.map((todo) => (
            <div key={todo.id} className="mb-5">
              <h4>{todo.title}</h4>
              <p>{todo.description}</p>
              <p>{todo.deadline}</p>
              <label>
                completed
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() =>
                    updateTodo.mutate({
                      id: Number(params.id),
                      todoId: todo.id,
                      data: { completed: !todo.completed },
                    })
                  }
                />
              </label>
              <div>
                <button
                  onClick={() =>
                    deleteTodo.mutate({
                      id: Number(params.id),
                      todoId: todo.id,
                    })
                  }
                >
                  delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default Todos;
