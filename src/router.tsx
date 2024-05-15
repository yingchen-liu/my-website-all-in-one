import {createBrowserRouter} from 'react-router-dom';
import Home from './routes/Home';
import SkillTree from './routes/SkillTree';

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/skill-tree', element: <SkillTree /> }
]);