import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { sendOTP, verifyOTP, clearError} from '../features/auth/authSlice'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { step, loading, error, token } = useSelector(s => s.auth)

  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()]

  useEffect(() => { if (token) navigate('/') }, [token, navigate])

  useEffect(() => {
    if (!error) return
    if (error.toLowerCase().includes('not yet registered')) {
      toast.error('Number not registered. Use Skip for local dev or contact nk@allsoft.co', { duration: 5000 })
    } else {
      toast.error(error)
    }
  }, [error])

  function sendOtp(e) {
    e.preventDefault()
    if (mobile.length !== 10) { toast.error('Enter a valid 10-digit number'); return }
    dispatch(clearError())
    dispatch(sendOTP(mobile))
  }

  function verifyOtp(e) {
    e.preventDefault()
    const code = otp.join('')
    if (code.length !== 6) { toast.error('Enter the 6-digit OTP'); return }
    dispatch(clearError())
    dispatch(verifyOTP({ mobile, otp: code }))
  }

  function onDigitChange(i, val) {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[i] = val
    setOtp(next)
    if (val && i < 5) refs[i + 1].current?.focus()
  }

  function onDigitKey(i, e) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs[i - 1].current?.focus()
  }

  function onOtpPaste(e) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) { setOtp(pasted.split('')); refs[5].current?.focus() }
    e.preventDefault()
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>Document<span style={{ color: 'var(--accent)' }}>Management System</span></div>
        </div>

        {step === 'mobile' && (
          <form onSubmit={sendOtp}>
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ background: 'var(--input)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--muted)', fontSize: '0.9rem', padding: '0.6rem 0.75rem', whiteSpace: 'nowrap' }}>+91</span>
                <input className="form-control" type="tel" maxLength={10} value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ''))} placeholder="10-digit number" autoFocus />
              </div>
            </div>
            <button className="btn btn-primary w-full" type="submit" disabled={loading}>
              {loading ? <><span className="spinner" /> Sending…</> : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={verifyOtp}>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.25rem' }}>
              OTP sent to <strong style={{ color: 'var(--text)' }}>+91 {mobile}</strong>
            </p>
            <div className="otp-inputs" onPaste={onOtpPaste} style={{ marginBottom: '1.25rem' }}>
              {otp.map((d, i) => (
                <input key={i} ref={refs[i]} className="otp-input" type="text" inputMode="numeric" maxLength={1} value={d}
                  onChange={e => onDigitChange(i, e.target.value)} onKeyDown={e => onDigitKey(i, e)} autoFocus={i === 0} />
              ))}
            </div>
            <button className="btn btn-primary w-full" type="submit" disabled={loading}>
              {loading ? <><span className="spinner" /> Verifying…</> : 'Verify OTP'}
            </button>
            <button type="button" className="btn btn-secondary w-full" style={{ marginTop: '0.75rem' }}
              onClick={() => { dispatch({ type: 'auth/setStep', payload: 'mobile' }); setOtp(['','','','','','']) }}>
              ← Change Number
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
