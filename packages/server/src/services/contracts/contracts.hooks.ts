import afterFindContract from '../../hooks/after-find-contract'
import beforeCreateContract from '../../hooks/before-create-contract'

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [beforeCreateContract()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [afterFindContract()],
    get: [afterFindContract()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
