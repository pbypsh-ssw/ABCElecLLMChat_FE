import { Provider } from 'react-redux'
import AppRouter from './router/index.jsx'
import { store } from './store/index.js'

function App() {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  )
}

export default App
