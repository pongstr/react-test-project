import React from 'react'

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
