// import express from 'express'
// import bodyParser from 'body-parser'
// import catchPromiseErrors from 'async-error-catcher'
// import crypto from 'crypto'
//
// export function listen(config) {
//
//   const app = express()
//   app.set('port', (process.env.PORT || 3434))
//   app.use(bodyParser.json({ verify: verifyRequestSignature }))
//
//   app.get('/', (req, res) => res.send('kit-engine-messenger is good to go!'))
//   app.get('/kit/engine/messenger', catchPromiseErrors(handleWebhookGet))
//   app.post('/kit/engine/messenger', catchPromiseErrors(handleWebhookPost))
//
//   app.use((err, req, res, next) => {
//     console.error(err.stack || err)
//     console.error('============')
//     res.sendStatus(200)
//   })
//
//   app.listen(app.get('port'), function() {
//     console.log('kit-engine-messenger')
//     console.log('------------------------------------------------ \n')
//     console.log('Server Started \n')
//     console.log(`PORT: ${app.get('port')}`)
//     console.log('================================================')
//     console.log('================================================')
//   })
//
//
//
//
//
// }
