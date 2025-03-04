import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "./layout/Layout";
import TodoList from "./pages/TodoList";
import Todos from "./Todos";
import Settings from "./pages/Settings";
import { useThemeContext } from "./ThemeContext";

function App() {
  const { theme } = useThemeContext();
  return (
    <div data-theme={theme} className="bg-background dark:bg-background">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<TodoList />} />
            <Route path="todos/:id" element={<Todos />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
