// Initializes the `blocks` service on path `/blocks`
import { ServiceAddons } from '@feathersjs/feathers'

import { Application } from '../../declarations'
import { CompilerService } from './compiler.class'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    compiler: CompilerService & ServiceAddons<any>
  }
}

export default function(app: Application) {
  // Initialize our service with any options it requires
  app.use('/compiler', new CompilerService())
}
