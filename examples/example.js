import kit from '../src'
import engine from '../src/engines'

kit.config({
  middleware: [ fn1, fn2 ],
  engines: [ engine.messenger ],
})

function fn1(pkt) {
  console.log('MIDDLEWARE 1 ')
  console.log('==================================================')
  pkt.in.event += 5
  return pkt
}

async function fn2(pkt) {
  await timeout(2000)
  pkt.in.event += 100
  test = 'nada'
  return pkt
}

export function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

kit.listen()
