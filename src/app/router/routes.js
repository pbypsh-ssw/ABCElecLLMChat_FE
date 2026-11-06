import { redirect } from 'react-router'
import { PATHS } from '../../core/constants/paths.js'
import { ChatPage } from '../../features/chat'
import HomePage from '../../features/home/pages/HomePage.jsx'
import ProductPage from '../../features/product/pages/ProductPage.jsx'
import RootLayout from './RootLayout.jsx'

export const routes = [
  {
    Component: RootLayout,
    children: [
      { path: PATHS.HOME, Component: HomePage },
      { path: PATHS.PRODUCTS, Component: ProductPage },
      { path: PATHS.CHAT, Component: ChatPage },
      { path: '*', loader: () => redirect(PATHS.HOME) },
    ],
  },
]
