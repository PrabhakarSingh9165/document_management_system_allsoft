import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDocuments, setFilters, setPage, clearFilters } from '../features/search/searchSlice'
import { fetchTags } from '../features/upload/uploadSlice'
import TagInput from '../components/common/TagInput'
import PreviewModal from '../components/common/PreviewModal'
import Navbar from '../components/layout/Navbar'
import toast from 'react-hot-toast'
import JSZip from 'jszip'

const cats = ['Personal', 'Professional']

const blank = { major_head: '', minor_head: '', from_date: '', to_date: '', tags: [], uploaded_by: '', search: { value: '' } }

export default function SearchPage() {
  const dispatch = useDispatch()
  const { results, total, loading, error, start, length } = useSelector(s => s.search)
  const { tags: tagList } = useSelector(s => s.upload)

  const [filters, setLocal] = useState(blank)
  const [preview, setPreview] = useState(null)
  const [zipping, setZipping] = useState(false)

  useEffect(() => { dispatch(fetchTags('')); search(0) }, [])
  useEffect(() => { if (error) toast.error(error) }, [error])

  function search(offset = 0) {
    dispatch(setFilters(filters))
    dispatch(setPage(offset))
    dispatch(fetchDocuments({ ...filters, tags: filters.tags.map(t => ({ tag_name: t })), start: offset, length, filterId: '', search: filters.search }))
  }

  function reset() {
    setLocal(blank)
    dispatch(clearFilters())
    dispatch(fetchDocuments({ ...blank, start: 0, length, filterId: '' }))
  }

  function set(k, v) { setLocal(p => ({ ...p, [k]: v })) }

  async function downloadAll() {
    if (!results.length) return
    setZipping(true)
    try {
      const zip = new JSZip()
      let n = 0
      await Promise.all(results.map(async (doc, i) => {
        const url = doc.file_url || doc.document_url || doc.url
        const name = doc.file_name || doc.document_name || `doc_${i + 1}`
        if (!url) return
        try { zip.file(name, await (await fetch(url)).blob()); n++ } catch {}
      }))
      if (!n) { toast.error('No files to download'); setZipping(false); return }
      const a = document.createElement('a')
      a.href = URL.createObjectURL(await zip.generateAsync({ type: 'blob' }))
      a.download = 'documents.zip'
      a.click()
      toast.success(`Downloaded ${n} file(s)`)
    } catch { toast.error('Download failed') }
    setZipping(false)
  }

  const pages = Math.ceil(total / length)
  const page = Math.floor(start / length)

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>Search Documents</h1>

        {/* Filters */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            <div className="form-group">
              <label className="form-label">Keyword</label>
              <input className="form-control" placeholder="Search…" value={filters.search?.value || ''} onChange={e => set('search', { value: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-control" value={filters.major_head} onChange={e => set('major_head', e.target.value)}>
                <option value="">All</option>
                {cats.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Sub-Category</label>
              <input className="form-control" placeholder="HR, Finance, John…" value={filters.minor_head} onChange={e => set('minor_head', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Uploaded By</label>
              <input className="form-control" placeholder="User ID" value={filters.uploaded_by} onChange={e => set('uploaded_by', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">From Date</label>
              <input type="date" className="form-control" value={filters.from_date} onChange={e => set('from_date', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">To Date</label>
              <input type="date" className="form-control" value={filters.to_date} onChange={e => set('to_date', e.target.value)} />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Tags</label>
            <TagInput tags={filters.tags} onChange={t => set('tags', t)} suggestions={tagList} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={() => search(0)} disabled={loading}>
              {loading ? <><span className="spinner" /> Searching…</> : 'Search'}
            </button>
            <button className="btn btn-secondary" onClick={reset}>Reset</button>
          </div>
        </div>

        {/* Results */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
              {loading ? 'Loading…' : `${total} result(s)`}
            </span>
            {results.length > 0 && (
              <button className="btn btn-secondary btn-sm" onClick={downloadAll} disabled={zipping}>
                {zipping ? <><span className="spinner" /> Zipping…</> : 'Download All ZIP'}
              </button>
            )}
          </div>

          {!loading && !results.length && (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem 0' }}>No documents found.</p>
          )}

          {!loading && results.length > 0 && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th><th>File</th><th>Category</th><th>Sub</th><th>Date</th><th>Tags</th><th>By</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((doc, i) => (
                    <tr key={doc.id || doc.document_id || i}>
                      <td style={{ color: 'var(--muted)' }}>{start + i + 1}</td>
                      <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {doc.file_name || doc.document_name || 'Untitled'}
                      </td>
                      <td>{doc.major_head || '—'}</td>
                      <td>{doc.minor_head || '—'}</td>
                      <td style={{ whiteSpace: 'nowrap', color: 'var(--muted)' }}>{doc.document_date || '—'}</td>
                      <td>
                        {(doc.tags || []).slice(0, 3).map((t, ti) => (
                          <span key={ti} className="tag" style={{ marginRight: 3 }}>{t.tag_name || t}</span>
                        ))}
                        {(doc.tags || []).length > 3 && <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>+{doc.tags.length - 3}</span>}
                      </td>
                      <td style={{ color: 'var(--muted)' }}>{doc.uploaded_by || doc.user_id || '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => setPreview(doc)}>Preview</button>
                          <a href={doc.file_url || doc.document_url || doc.url || '#'} download={doc.file_name} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">↓</a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', marginTop: '1rem' }}>
              <button className="btn btn-secondary btn-sm" disabled={page === 0} onClick={() => search((page - 1) * length)}>‹</button>
              <span style={{ padding: '0.4rem 0.6rem', fontSize: '0.82rem', color: 'var(--muted)' }}>Page {page + 1} / {pages}</span>
              <button className="btn btn-secondary btn-sm" disabled={page >= pages - 1} onClick={() => search((page + 1) * length)}>›</button>
            </div>
          )}
        </div>
      </div>

      {preview && <PreviewModal doc={preview} onClose={() => setPreview(null)} />}
    </>
  )
}
