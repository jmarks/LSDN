import React from 'react'
import NavigationBar from './NavigationBar'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="layout-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavigationBar />
      <main className="layout-main" style={{ flex: 1 }}>
        {children}
      </main>
      <footer className="simple-footer" style={{ padding: '2rem', textAlign: 'center', background: 'white', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.9rem' }}>
        <p>© 2024 Local Singles Date Night. Investing in community.</p>
      </footer>
    </div>
  )
}

export default Layout
