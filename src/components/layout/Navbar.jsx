import { NavLink } from 'react-router-dom'

export default function Navbar() {

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="navbar-brand">Doc<span>Vault</span></NavLink>
        <div className="navbar-nav">
          <NavLink to="/upload" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Upload</NavLink>
          <NavLink to="/search" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Search</NavLink>
          <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Admin</NavLink>
        </div>
      </div>
    </nav>
  )
}
