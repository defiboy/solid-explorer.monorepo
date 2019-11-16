import afterFindBlock from '../../hooks/after-find-block'
import beforeCreateBlock from '../../hooks/before-create-block'

export default {
  before: {
    all: [
      context => {
        console.log('Before All Blocks Hooks!')
      }
    ],
    find: [],
    get: [],
    create: [beforeCreateBlock()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [afterFindBlock()],
    get: [afterFindBlock()],
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
