import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import bridge from '@vkontakte/vk-bridge';
import './styles/index.css';
import {App} from './App.jsx'

try {
  bridge?.send?.("VKWebAppInit").then((res) => console.log('res', res)).catch((e) => console.log('VKWebAppInit error', e));
} catch (e) {
  console.log('VK bridge error', e)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
