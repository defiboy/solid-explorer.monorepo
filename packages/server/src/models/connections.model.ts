import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize'

import { Connection } from '@solidstudio/types'

import { Application } from '../declarations'

interface ConnectionModel extends Model, Connection {}

type ConnectionModelStatic = typeof Model & (new (values?: object, options?: BuildOptions) => ConnectionModel)

export default function(app: Application) {
  const sequelize: Sequelize = app.get('sequelizeClient')

  const connections = sequelize.define(
    'connections',
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING(128),
        allowNull: false
      },
      url: {
        type: DataTypes.STRING(128),
        allowNull: false
        // validate: {
        //   isUrl: true
        // }
      },
      lastBlockNumberProcessed: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      hooks: {
        beforeCount(options: any) {
          options.raw = true
        }
      }
    }
  ) as ConnectionModelStatic

  return connections
}
