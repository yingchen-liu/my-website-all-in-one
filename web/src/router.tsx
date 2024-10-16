import { createBrowserRouter } from "react-router-dom";
import Home from "./routes/Home";
import Apps from "./routes/Apps";
import Resume from "./routes/Resume";
import MyTreeNotes from "./routes/MyTreeNotes";
import TreeNotes from "./routes/TreeNotes";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/apps", element: <Apps /> },
  { path: "/tree-notes/my", element: <MyTreeNotes /> },
  { path: "/tree-notes", element: <TreeNotes /> },
  { path: "/resume", element: <Resume /> },
]);
