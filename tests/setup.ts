import { config } from '@vue/test-utils'

const warn = console.warn
console.warn = (msg: any, ...args: any[]) => {
  if (typeof msg === 'string' && msg.includes('<Suspense> is an experimental feature')) return
  warn(msg, ...args)
}
