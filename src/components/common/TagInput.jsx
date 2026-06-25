import { useState, useRef } from 'react'

export default function TagInput({ tags, onChange, suggestions = [] }) {
  const [val, setVal] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef()

  const matches = suggestions
    .filter(s => { const n = s.tag_name || s; return n.toLowerCase().includes(val.toLowerCase()) && !tags.includes(n) })
    .slice(0, 8)

  function add(v) {
    const t = v.trim()
    if (!t || tags.includes(t)) return
    onChange([...tags, t])
    setVal('')
    setOpen(false)
  }

  function onKey(e) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(val) }
    else if (e.key === 'Backspace' && !val && tags.length) onChange(tags.slice(0, -1))
  }

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{ background: 'var(--input)', border: '1px solid var(--border)', borderRadius: 6, display: 'flex', flexWrap: 'wrap', gap: '0.35rem', minHeight: 42, padding: '0.35rem 0.7rem', cursor: 'text' }}
        onClick={() => ref.current?.focus()}
      >
        {tags.map(t => (
          <span key={t} className="tag">
            {t} <button type="button" className="tag-remove" onClick={() => onChange(tags.filter(x => x !== t))}>×</button>
          </span>
        ))}
        <input ref={ref} value={val} onChange={e => { setVal(e.target.value); setOpen(true) }} onKeyDown={onKey}
          onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={tags.length ? '' : 'Type and press Enter…'}
          style={{ background: 'transparent', border: 'none', color: 'var(--text)', flex: 1, fontSize: '0.88rem', minWidth: 100, outline: 'none' }}
        />
      </div>
      {open && val && matches.length > 0 && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, left: 0, right: 0, marginTop: 3, position: 'absolute', zIndex: 50, overflow: 'hidden' }}>
          {matches.map(s => {
            const n = s.tag_name || s
            return (
              <button key={n} type="button" onMouseDown={() => add(n)}
                style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'block', fontSize: '0.85rem', padding: '0.55rem 0.9rem', textAlign: 'left', width: '100%' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(79,110,247,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >{n}</button>
            )
          })}
        </div>
      )}
    </div>
  )
}
