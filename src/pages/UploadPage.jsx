import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTags, submitUpload, resetUpload } from '../features/upload/uploadSlice'
import TagInput from '../components/common/TagInput'
import Navbar from '../components/layout/Navbar'
import toast from 'react-hot-toast'

const cats = ['Personal', 'Professional']
const subCats = {
  Personal: ['John', 'Tom', 'Emily', 'Sarah', 'Michael', 'David', 'Anna'],
  Professional: ['Accounts', 'HR', 'IT', 'Finance', 'Operations', 'Marketing', 'Legal'],
}

export default function UploadPage() {
  const dispatch = useDispatch()
  const { tags: tagList, loading, success, error } = useSelector(s => s.upload)
  const { mobile } = useSelector(s => s.auth)

  const [form, setForm] = useState({ major_head: '', minor_head: '', document_date: '', document_remarks: '' })
  const [tags, setTags] = useState([])
  const [file, setFile] = useState(null)
  const fileRef = useRef()

  useEffect(() => { dispatch(fetchTags('')) }, [dispatch])

  useEffect(() => {
    if (success) { toast.success('Uploaded!'); reset(); dispatch(resetUpload()) }
  }, [success])

  useEffect(() => { if (error) toast.error(error) }, [error])

  function reset() {
    setForm({ major_head: '', minor_head: '', document_date: '', document_remarks: '' })
    setTags([])
    setFile(null)
  }

  function onFileChange(e) {
    const f = e.target.files[0]
    if (!f) return
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
    if (!allowed.includes(f.type)) { toast.error('Only images and PDF allowed'); return }
    if (f.size > 10 * 1024 * 1024) { toast.error('Max file size is 10MB'); return }
    setFile(f)
  }

  function submit(e) {
    e.preventDefault()
    if (!file) { toast.error('Select a file'); return }
    if (!form.major_head) { toast.error('Select a category'); return }
    if (!form.minor_head) { toast.error('Select a sub-category'); return }
    if (!form.document_date) { toast.error('Pick a date'); return }

    dispatch(submitUpload({ file, ...form, tags, user_id: mobile || 'user' }))
  }

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>Upload Document</h1>

        <form onSubmit={submit} style={{ maxWidth: 580 }}>
          <div className="card">
            <div className="form-group">
              <label className="form-label">File * (PDF, JPG, PNG — max 10MB)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => fileRef.current?.click()}>
                  Choose File
                </button>
                <span style={{ color: file ? 'var(--text)' : 'var(--muted)', fontSize: '0.85rem' }}>
                  {file ? `${file.name} (${(file.size / 1024).toFixed(0)} KB)` : 'No file chosen'}
                </span>
                {file && (
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => setFile(null)}>✕</button>
                )}
              </div>
              <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.gif,.webp" style={{ display: 'none' }} onChange={onFileChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Document Date *</label>
              <input type="date" className="form-control" value={form.document_date} onChange={e => set('document_date', e.target.value)} />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-control" value={form.major_head} onChange={e => { set('major_head', e.target.value); set('minor_head', '') }}>
                  <option value="">Select…</option>
                  {cats.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{form.major_head === 'Personal' ? 'Name' : 'Department'} *</label>
                <select className="form-control" value={form.minor_head} onChange={e => set('minor_head', e.target.value)} disabled={!form.major_head}>
                  <option value="">{form.major_head ? 'Select…' : 'Pick category first'}</option>
                  {(subCats[form.major_head] || []).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tags</label>
              <TagInput tags={tags} onChange={setTags} suggestions={tagList} />
            </div>

            <div className="form-group">
              <label className="form-label">Remarks</label>
              <textarea className="form-control" rows={3} value={form.document_remarks} onChange={e => set('document_remarks', e.target.value)} placeholder="Optional notes…" />
            </div>

            <button className="btn btn-primary w-full" type="submit" disabled={loading}>
              {loading ? <><span className="spinner" /> Uploading…</> : 'Upload Document'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
