import { useEffect } from 'react'

export default function PreviewModal({ doc, onClose }) {
  const url = doc?.file_url || doc?.document_url || doc?.url || null
  const name = doc?.file_name || doc?.document_name || 'Document'
  const isPdf = /\.pdf$/i.test(name) || doc?.file_type === 'pdf'
  const isImg = /\.(png|jpe?g|gif|webp)$/i.test(name)

  useEffect(() => {
    const esc = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onClose])

  async function download() {
    if (!url) return
    try {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(await (await fetch(url)).blob())
      a.download = name; a.click()
    } catch { window.open(url, '_blank') }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, maxHeight: '90vh', maxWidth: 760, overflow: 'auto', padding: '1.5rem', width: '100%', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontWeight: 600 }}>{name}</div>
            {doc?.major_head && <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{doc.major_head} › {doc.minor_head}</div>}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          {!url ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem 0' }}>No preview available.</p>
          ) : isPdf ? (
            <iframe src={url} style={{ width: '100%', height: 480, border: 'none', borderRadius: 6 }} title={name} />
          ) : isImg ? (
            <img src={url} alt={name} style={{ width: '100%', borderRadius: 6 }} />
          ) : (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem 0' }}>This file type can't be previewed.</p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          {url && <button className="btn btn-primary" onClick={download}>Download</button>}
        </div>
      </div>
    </div>
  )
}
