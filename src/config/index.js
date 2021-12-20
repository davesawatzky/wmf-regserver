const convict = require('convict')
const convictFormat = require('convict-format-with-validator')

convict.addFormats(convictFormat)

// Define a schema
const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  ip: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'IP_ADDRESS',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 8081,
    env: 'PORT',
    arg: 'port',
  },
  db: {
    useTLS: {
      doc: 'whether or not we should use TLS to connect to our database',
      default: true,
      format: 'Boolean',
      env: 'DB_USE_TLS',
    },
  },
  admins: {
    doc: 'Users with write access, or null to grant full access without login.',
    format: Array,
    nullable: true,
    default: null,
  },
  cors: {
    origin: {
      doc: 'Address acceptable for cors policy',
      format: 'url',
      default: 'http://localhost:3000',
    },
    optionsSuccessStatus: {
      default: 403,
    },
  },
})

// Load environment dependent configuration
const env = config.get('env')
config.loadFile(`./src/config/${env}.json`)

// Perform validation
config.validate({ allowed: 'strict' })

module.exports = { ...config.getProperties() }
