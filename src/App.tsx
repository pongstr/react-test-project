import short from 'short-uuid'
import React, { memo, useCallback, useState } from 'react'
import { batch, observable, ObservableObject } from '@legendapp/state'
import { useSelector, enableLegendStateReact } from '@legendapp/state/react'
import { ObservablePersistLocalStorage } from '@legendapp/state/local-storage'
import {
  configureObservablePersistence,
  persistObservable,
} from '@legendapp/state/persist'
import * as collection from './data/users.json'
import './App.css'

type UserModelType = {
  uid: string
  name: string
  selected: boolean
  description: string
  link?: string
  index: number
}

type SelectedUserModelType = UserModelType & {
  id: string | number
  index: number
}

type UsersDatabaseType = {
  data: UserModelType[]
}

type SelectedDatabaseType = {
  data: SelectedUserModelType[]
}

/**
 * Let's setup the state manager in this section. We'll use Legend State
 * we're trying out an observable state in react.
 *
 * The setup:
 *  let's use 2 dataset that will store the original list and one that will
 *  store the selected data.
 *  - dataset a should remain unchanged
 *  - dataset b is where we store data from user input
 *
 */

// Dataset-A: Namespace
const STORAGE_COLLECTION = 'collection.users'
// Dataset-B: Namespace
const STORAGE_SELECTED = 'collection.selected'

// These are LegendState pre-requisites for react
enableLegendStateReact()
// this part is optional, but it stores data to localstorage
configureObservablePersistence({
  persistLocal: ObservablePersistLocalStorage,
})

/**
 * CreateUsers:
 * - is a function that loads the users list and stores it in the localstorage
 * - when users collection is empty, we'll create the list
 * - otherwise always return the one that's already stored
 */
const createUsers = (): UsersDatabaseType => {
  if (!window.localStorage.getItem(STORAGE_COLLECTION)) {
    window.localStorage.setItem(
      STORAGE_COLLECTION,
      JSON.stringify({
        data: collection.items.map(
          (user: Partial<UserModelType>, index: number) => ({
            ...user,
            uid: short.uuid(),
            selected: false,
            link: user.link ?? '',
            index,
          }),
        ),
      }),
    )
  }
  return JSON.parse(window.localStorage.getItem(STORAGE_COLLECTION) as string)
}

/**
 * This is the part where we setup legend-state observables
 * that will be utilized for our react app
 */
const usersDatabase$ = observable(createUsers())
persistObservable(usersDatabase$, {
  local: STORAGE_COLLECTION,
})

/**
 * In addition to `usersDatabase$` we'll setup dataset-b here
 * where we'll store selected items
 */
const selectedDatabase$ = observable<SelectedDatabaseType>({ data: [] })
persistObservable(selectedDatabase$, {
  local: STORAGE_SELECTED,
})

/**
 * UsersCollectionItem Component
 */
const UsersCollectionItem: React.FC<{
  user: ObservableObject<UserModelType>
  index: number
}> = ({ user, index }) => {
  const isSelected = useSelector(() => user.selected.get())

  const onCheckboxChange = (e: React.FormEvent<HTMLInputElement>): void => {
    batch(() => user.selected.set(e.currentTarget.checked))

    const collection = selectedDatabase$.data
    const presence = collection.findIndex(
      (item: SelectedUserModelType) => item.uid === user.uid.peek(),
    )

    if (presence === -1 && e.currentTarget.checked) {
      const current = user.get()
      selectedDatabase$.data.push({ ...current, index, id: current.uid })
      return
    }

    if (presence > -1 && !e.currentTarget.checked) {
      selectedDatabase$.data.splice(presence, 1)
      return
    }
  }

  const handleSelectCheckbox = useCallback(onCheckboxChange, [index, user])
  return (
    <label
      className="cursor-pointer p-2 flex justify-start items-center"
      htmlFor={user.uid.peek()}
      title={`${user.name.get()} - ${user.description.get()}`}
    >
      <div className="mr-4">
        <input
          type="checkbox"
          id={user.uid.peek()}
          checked={isSelected}
          onChange={handleSelectCheckbox}
          className="cursor-pointer"
        />
      </div>
      <div>
        <span className="block font-bold text-sm">{user.name}</span>
        <span className="block font-light text-xs text-gray-500">
          {user.description}
        </span>
      </div>
    </label>
  )
}

/**
 * Select All Items Component
 */
const SelectAllItems: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false)
  const handleSelectAll = (e: React.FormEvent<HTMLInputElement>) => {
    setIsChecked(e.currentTarget.checked)

    if (!e.currentTarget.checked) {
      batch(() => {
        usersDatabase$.data.map((user: ObservableObject<UserModelType>) => {
          user.selected.set(false)
          return user
        })
        selectedDatabase$.data.set([])
      })

      return
    }

    batch(() => {
      usersDatabase$.data.map((user: ObservableObject<UserModelType>) => {
        user.selected.set(true)
        return user
      })

      const users = usersDatabase$.data.get().map((user: UserModelType) => ({
        ...user,
        id: user.uid,
        selected: true,
      }))

      selectedDatabase$.data.set(users)
    })
  }

  const useHandleSelectAll = useCallback(handleSelectAll, [])
  return (
    <label className="flex justify-start items-center cursor-pointer px-2">
      <div className="mr-4">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={useHandleSelectAll}
        />
      </div>
      <span className="list-header-label">Usernames</span>
    </label>
  )
}
/**
 *  UsersCollectList Component
 */
const UsersCollectionList: React.FC = () => {
  return (
    <>
      <div className="list-header">
        <SelectAllItems />
      </div>
      <ul className="list-collection">
        {usersDatabase$.data.map(
          (user: ObservableObject<UserModelType>, index: number) => (
            <li key={String(user.uid.peek())} className="list-user-item">
              <UsersCollectionItem index={index} user={user} />
            </li>
          ),
        )}
      </ul>

      <div className="list-footer">
        To deselect a user from the selected list, simply uncheck the the box
        beside their name.
      </div>
    </>
  )
}

/**
 * UserSeletedItem Component
 */
const UserSelectedItem: React.FC<{
  item: SelectedUserModelType
}> = ({ item }) => {
  return (
    <li className="list-user-item">
      <code>&#91;{item.index}&#93;</code>
      <span>&nbsp;{item.name}</span>
    </li>
  )
}

/**
 * UserSelectedList Component
 */
const UserSelectedList: React.FC<{
  render: (selected: SelectedUserModelType) => React.ReactElement
}> = ({ render }) => {
  const selectedDatabase = useSelector(() => selectedDatabase$.data.get())
  return (
    <>
      <ul className="list-collection">
        {selectedDatabase.length === 0 && (
          <li className="h-[80vh] flex justify-center items-center">
            <div className="text-center p-10">
              <span className="block font-bold mb-0">No Selected Users</span>
              <small className="text-gray-500">
                To select a user, click on the checkbox beside their name.
              </small>
            </div>
          </li>
        )}

        {selectedDatabase.map((selected: SelectedUserModelType) => (
          <React.Fragment key={selected.uid}>{render(selected)}</React.Fragment>
        ))}
      </ul>
    </>
  )
}

/**
 * Root App
 */
const App: React.FC = () => {
  const MemoUserSelectedItem = memo((opts: { item: SelectedUserModelType }) => (
    <UserSelectedItem item={opts.item} />
  ))

  return (
    <React.StrictMode>
      <div className="collection-list-container">
        <div className="collection-list-column">
          <UsersCollectionList />
        </div>
        <div className="collection-list-column">
          <div className="list-header py-3">
            <span className="list-header-label">Selected Users</span>
          </div>
          <UserSelectedList
            render={(user: SelectedUserModelType) => (
              <MemoUserSelectedItem item={user} />
            )}
          />
        </div>
      </div>
    </React.StrictMode>
  )
}

export default App
