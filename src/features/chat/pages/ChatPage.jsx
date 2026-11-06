import ChatPanel from '../components/ChatPanel.jsx'
import { chatCssVariables } from '../constants/cssVariables.js'
import '../design.css'

function ChatPage() {
  return (
    <section className="chat-page bg-page" style={chatCssVariables}>
      <ChatPanel />
    </section>
  )
}

export default ChatPage
