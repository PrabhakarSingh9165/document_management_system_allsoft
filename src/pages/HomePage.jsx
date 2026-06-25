import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem' }}>Dashboard</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Welcome to Document Management System — upload, search and manage documents.</p>

        <div className="grid-2" style={{ maxWidth: 600 }}>
          <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('/upload')}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⬆</div>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Upload Document</div>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Add new PDF or image files with tags and metadata.</p>
          </div>
          <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('/search')}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔍</div>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Search Documents</div>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Filter by category, date, tags and download files.</p>
          </div>
        </div>
      </div>
    </>
  )
}
