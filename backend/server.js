import app from './src/app.js'
import env from './src/config/env.js'

app.listen(env.port, () => {
  console.log(`Kimty's Collection API running on http://localhost:${env.port} (${env.nodeEnv})`)
})