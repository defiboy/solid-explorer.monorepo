import path from 'path'
import { Sequelize } from 'sequelize'

import { Application } from './declarations'

export default function(app: Application) {
  const connectionString = app.get('sqlite')
  const connectionPath = path.join(process.cwd(), connectionString)
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: false,
    define: {
      freezeTableName: true
    },
    storage: connectionPath
  })

  const oldSetup = app.setup

  app.set('sequelizeClient', sequelize)

  app.setup = function(...args) {
    const result = oldSetup.apply(this, args)

    // Set up data relationships
    const models = sequelize.models
    Object.keys(models).forEach(name => {
      if ('associate' in models[name]) {
        ;(models[name] as any).associate(models)
      }
    })

    // Sync to the database
    app.set('sequelizeSync', sequelize.sync())

    return result
  }
}
