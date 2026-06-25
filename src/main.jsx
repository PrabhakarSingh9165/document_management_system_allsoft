import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { store } from './app/store.js'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#181c27',
            color: '#e8eaf0',
            border: '1px solid #2a2f45',
            fontSize: '0.88rem',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#181c27' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#181c27' } },
        }}
      />
    </Provider>
  </React.StrictMode>
)
