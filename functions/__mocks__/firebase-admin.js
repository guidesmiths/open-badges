const admin = jest.genMockFromModule('firebase-admin')

let lastRef
let dataDb = {}

admin.initializeApp = jest.fn(() => {})
admin.database = jest.fn(() => admin)
admin.ref = jest.fn((path) => {
  lastRef = path
  return admin
})
admin.once = jest.fn(() => ({
  val: () => dataDb[lastRef] || null
}))

admin.flush = () => {
  dataDb = {}
  lastRef = undefined
}
admin.setDatabase = data => { dataDb = data || {} }

module.exports = admin
