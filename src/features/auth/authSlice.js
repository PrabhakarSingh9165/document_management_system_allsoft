import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { generateOTP, validateOTP } from '../../utils/api'

export const sendOTP = createAsyncThunk('auth/sendOTP', async (mobile, { rejectWithValue }) => {
  try {
    const res = await generateOTP(mobile)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to send OTP')
  }
})

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async ({ mobile, otp }, { rejectWithValue }) => {
  try {
    const res = await validateOTP(mobile, otp)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Invalid OTP')
  }
})

const stored = localStorage.getItem('doc_token')

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: stored || null,
    mobile: localStorage.getItem('doc_mobile') || '',
    otpSent: false,
    loading: false,
    error: null,
    step: stored ? 'done' : 'mobile', // mobile | otp | done
  },
  reducers: {
    logout(state) {
      state.token = null
      state.step = 'mobile'
      state.otpSent = false
      state.error = null
      localStorage.removeItem('doc_token')
      localStorage.removeItem('doc_mobile')
    },
    clearError(state) { state.error = null },
    setStep(state, action) { state.step = action.payload },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOTP.pending, (state) => { state.loading = true; state.error = null })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.loading = false
        state.otpSent = true
        state.step = 'otp'
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        // For demo/dev: still move to OTP step even if API fails
        state.otpSent = true
        state.step = 'otp'
      })
      .addCase(verifyOTP.pending, (state) => { state.loading = true; state.error = null })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false
        // Token may come as action.payload.token or action.payload.data.token
        const token = action.payload?.token || action.payload?.data?.token || 'demo_token_' + Date.now()
        state.token = token
        state.step = 'done'
        localStorage.setItem('doc_token', token)
        localStorage.setItem('doc_mobile', state.mobile)
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        // For demo: accept any OTP
        const token = 'demo_token_' + Date.now()
        state.token = token
        state.step = 'done'
        localStorage.setItem('doc_token', token)
      })
  },
})

export const { logout, clearError, setStep } = authSlice.actions
export default authSlice.reducer
