import React from 'react'
import * as collection from './data/users.json'
import './App.css'

type SelectedUserModelType = UserModelType & { index: number }
type SelectedUsersActionType = {
  type: 'add' | 'remove' | 'add-all' | 'remove-all'
  payload: SelectedUserModelType | SelectedUserModelType[]
}

type UserModelType = {
  uid: string
  name: string
  selected: boolean
  description: string
  link?: string
}

type CollectionListPropType = {
  collection: UserModelType[]
  render: (model: UserModelType, index: number) => React.ReactElement
}

/**
 * Root App
 */
const App: React.FC = () => {
  return (
    <React.StrictMode>
      <div className="collection-list-container">
        <div className="collection-list-column">{/* column 1 */}</div>
        <div className="collection-list-column">{/* column 2 */}</div>
      </div>
    </React.StrictMode>
  )
}

export default App
