import { createBrowserRouter, RouterProvider } from 'react-router'
import { routes } from './routes.js'

const router = createBrowserRouter(routes)

function AppRouter() {
  return <RouterProvider router={router} />
}

export default AppRouter
