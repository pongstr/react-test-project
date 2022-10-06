import React, { memo, useCallback } from 'react'
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
 * usersSelectedReducer
 * let's setup the reducer here, which will be utilized for users to read/write
 * dataset-b content
 */
const usersSelectedReducer = (
  prev: SelectedUserModelType[],
  action: SelectedUsersActionType,
): SelectedUserModelType[] => {
  const { type, payload } = action

  if (Array.isArray(payload)) {
    return type === 'add-all' ? [...payload] : []
  }

  const index = prev.findIndex(
    (user: SelectedUserModelType) => user.uid === payload.uid,
  )

  if (index === -1 && type === 'add') {
    return [...prev, payload]
  }

  if (index !== -1 && action.type === 'remove') {
    const items = prev.slice()
    items.splice(index, 1)
    return items
  }

  return prev
}

/**
 * A component that displays an item from Dataset-A
 */
const UserItem: React.FC<{
  user: SelectedUserModelType
  onSelect: (user: SelectedUserModelType) => void
}> = ({ user, onSelect }) => (
  <>
    <div className="mr-4">
      <input
        type="checkbox"
        id={user.uid}
        defaultChecked={user.selected}
        onChange={(e: React.FormEvent<HTMLInputElement>) =>
          onSelect({
            ...user,
            selected: e.currentTarget.checked,
          })
        }
      />
    </div>
    <label
      className="cursor-pointer"
      htmlFor={user.uid}
      title={`${user.name} - ${user.description}`}
    >
      <span className="block font-bold text-sm">{user.name}</span>
      <span className="block font-light text-xs text-gray-500">
        {user.description}
      </span>
    </label>
  </>
)

const CollectionList: React.FC<CollectionListPropType> = ({
  collection,
  render,
}) => {
  return (
    <div className="list-collection">
      {collection.map((user: UserModelType, index: number) => (
        <div key={user.uid} className="list-user-item">
          {render(user, index)}
        </div>
      ))}
    </div>
  )
}

/**
 * A component that displays Dataset-A
 */
const UsersResource: React.FC = () => {
  const [collection, setCollection] = useAtom(usersCollectionAtom)
  const [, dispatch] = useReducerAtom<
    SelectedUserModelType[],
    SelectedUsersActionType
  >(usersSelectedAtom, usersSelectedReducer)

  const UserItemMemo = memo(
    (opts: {
      user: SelectedUserModelType
      onSelect: (user: SelectedUserModelType) => void
    }) => <UserItem user={opts.user} onSelect={opts.onSelect} />,
  )

  const updateUserData = (u: SelectedUserModelType) => {
    setCollection(collection.map((usr) => (usr.uid === u.uid ? { ...u } : usr)))
    dispatch({
      type: u.selected ? 'add' : 'remove',
      payload: u,
    })
  }

  const selectAllUserData = (e: React.FormEvent<HTMLInputElement>): void => {
    setCollection(
      collection.map((item) => ({
        ...item,
        selected: e.currentTarget.checked,
      })),
    )
    dispatch({
      type: e.currentTarget.checked ? 'add-all' : 'remove-all',
      payload: [...collection].map(
        (user: UserModelType, index: number): SelectedUserModelType => ({
          ...user,
          index,
        }),
      ),
    })
  }

  const updateUserDataCallback = useCallback(updateUserData, [
    setCollection,
    collection,
    dispatch,
  ])

  const selectAllUserDataCallback = useCallback(selectAllUserData, [
    setCollection,
    collection,
    dispatch,
  ])

  return (
    <>
      <div className="list-header">
        <div className="mr-4">
          <input type="checkbox" onChange={selectAllUserDataCallback} />
        </div>
        <span className="list-header-label">Usernames</span>
      </div>
      <div className="list-collection">
        <CollectionList
          collection={collection}
          render={(user, index) => (
            <UserItemMemo
              user={{ ...user, index }}
              onSelect={updateUserDataCallback}
            />
          )}
        />
      </div>
      <div className="list-footer">
        To deselect a user from the selected list, simply uncheck the the box
        beside their name.
      </div>
    </>
  )
}

/**
 * A component that displays Dataset-B
 */
const UsersSelected: React.FC = () => {
  const [selected] = useAtom<SelectedUserModelType[]>(usersSelectedAtom)
  return selected.length === 0 ? (
    <div className="h-full flex justify-center items-center">
      <div className="text-center p-10">
        <span className="block font-bold mb-0">No Selected Users</span>
        <small className="text-gray-500">
          To select a user, click on the checkbox beside their name.
        </small>
      </div>
    </div>
  ) : (
    <>
      <div className="list-header py-3">
        <span className="list-header-label">Selected Users</span>
      </div>
      <div className="list-collection">
        {selected.map((user: SelectedUserModelType, index: number) => (
          <div className="p-2" key={String(index)}>
            <code>&#91;{user.index}&#93;</code>
            <span>&nbsp;{user.name}</span>
          </div>
        ))}
      </div>
    </>
  )
}

/**
 * Root App
 */
const App: React.FC = () => {
  return (
    <React.StrictMode>
      <div className="collection-list-container">
        <div className="collection-list-column">
          <UsersResource />
        </div>
        <div className="collection-list-column">
          <UsersSelected />
        </div>
      </div>
    </React.StrictMode>
  )
}

export default App
