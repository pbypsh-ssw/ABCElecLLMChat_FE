import { Outlet, useMatch } from 'react-router'
import Footer from '../../core/components/Footer.jsx'
import Header from '../../core/components/Header.jsx'
import { commonCssVariables } from '../../core/components/constants/cssVariables.js'
import { PATHS } from '../../core/constants/paths.js'
import { ChatWidget } from '../../features/chat'

function RootLayout() {
  const isChatPage = useMatch(PATHS.CHAT)

  return (
    <div className="app-layout" style={commonCssVariables}>
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
      {!isChatPage && <ChatWidget />}
    </div>
  )
}

export default RootLayout
