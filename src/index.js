import { Launch } from 'wpe-lightning-sdk'
import App from './Main.js'

export default function() {
  return Launch(App, ...arguments)
}
