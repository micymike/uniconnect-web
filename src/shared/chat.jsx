import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Chat = ({ recipient }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: 'user', timestamp: new Date() }])
      setNewMessage('')
    }
  }

  return (
    <div className="flex flex-col h-[400px] bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Chat with {recipient}</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <p>{message.text}</p>
              <span className="text-xs opacity-75">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-orange-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

Chat.propTypes = {
  recipient: PropTypes.string.isRequired,
}

export default Chat
