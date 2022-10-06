import React from 'react'
import short from 'short-uuid'
import { useAtom } from 'jotai'
import { atomWithStorage, useReducerAtom } from 'jotai/utils'
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
 * Let's setup the state manager in this section. We'll use Jotai
 * because I saw somewhere that this is cool, so we're trying it out.
 *
 * The setup:
 *  let's use 2 dataset that will store the original list and one that will
 *  store the selected data.
 *  - dataset a should remain unchanged
 *  - dataset b is where we store data from user input
 *
 */

// Dataset-A: Namespace
const STORAGE_COLLECTION = 'collection.list'
// Dataset-B: Namespace
const STORAGE_SELECTED = 'collection.selected'

/**
 * CreateUsers:
 * - is a function that loads the users list and stores it in the localstorage
 * - when users collection is empty, we'll create the list
 * - otherwise always return the one that's already stored
 */
const createUsers = (): UserModelType[] => {
  if (!window.localStorage.getItem(STORAGE_COLLECTION)) {
    window.localStorage.setItem(
      STORAGE_COLLECTION,
      JSON.stringify(
        collection.items.map((user: Partial<UserModelType>) => ({
          ...user,
          uid: short.uuid(),
          selected: false,
          link: user.link ?? '',
        })),
      ),
    )
  }
  return JSON.parse(window.localStorage.getItem(STORAGE_COLLECTION) as string)
}

// Intialize Dataset-A
const usersCollectionAtom = atomWithStorage(STORAGE_COLLECTION, createUsers())

//  Initialze Dataset-B
const usersSelectedAtom = atomWithStorage<SelectedUserModelType[]>(
  STORAGE_SELECTED,
  [],
)

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
