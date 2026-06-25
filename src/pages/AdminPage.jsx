import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import toast from 'react-hot-toast'

const defaultUsers = [
  { id: 1, username: 'admin', role: 'Admin', created: '2024-01-10' },
  { id: 2, username: 'nitin', role: 'Editor', created: '2024-02-15' },
]

export default function AdminPage() {
  const [users, setUsers] = useState(defaultUsers)
  const [form, setForm] = useState({ username: '', password: '', role: 'Editor' })

  function submit(e) {
    e.preventDefault()
    if (!form.username.trim() || form.username.length < 3) { toast.error('Username min 3 chars'); return }
    if (!form.password || form.password.length < 6) { toast.error('Password min 6 chars'); return }
    if (users.find(u => u.username === form.username)) { toast.error('Username taken'); return }
    setUsers(p => [...p, { id: Date.now(), username: form.username, role: form.role, created: new Date().toISOString().split('T')[0] }])
    setForm({ username: '', password: '', role: 'Editor' })
    toast.success('User created')
  }

  function remove(id) {
    if (id === 1) { toast.error("Can't delete default admin"); return }
    setUsers(p => p.filter(u => u.id !== id))
  }

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>Admin — User Management</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Create form */}
          <div className="card">
            <h2 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '1rem' }}>Create User</h2>
            <form onSubmit={submit}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input className="form-control" value={form.username} onChange={e => set('username', e.target.value)} placeholder="e.g. john_doe" />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 6 chars" />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-control" value={form.role} onChange={e => set('role', e.target.value)}>
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-full">Create User</button>
            </form>
          </div>

          {/* Users table */}
          <div className="card">
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>{users.length} user(s)</p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>#</th><th>Username</th><th>Role</th><th>Created</th><th></th></tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id}>
                      <td style={{ color: 'var(--muted)' }}>{i + 1}</td>
                      <td style={{ fontWeight: 500 }}>{u.username}</td>
                      <td>{u.role}</td>
                      <td style={{ color: 'var(--muted)' }}>{u.created}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => remove(u.id)} disabled={u.id === 1}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <style>{`@media(max-width:640px){.container > div > div:first-child{grid-column: 1 / -1}}`}</style>
      </div>
    </>
  )
}
