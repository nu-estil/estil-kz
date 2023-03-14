import { Persistor } from 'redux-persist'

declare module 'redux' {
  export interface Store {
    __persistor: Persistor
  }
}
