import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { uploadDocument, getDocumentTags } from '../../utils/api'

export const fetchTags = createAsyncThunk('upload/fetchTags', async (term = '', { rejectWithValue }) => {
  try {
    const res = await getDocumentTags(term)
    return res.data?.data || res.data || []
  } catch {
    return []
  }
})

export const submitUpload = createAsyncThunk('upload/submit', async (payload, { rejectWithValue }) => {
  try {
    const formData = new FormData()
    formData.append('file', payload.file)
    formData.append('data', JSON.stringify({
      major_head: payload.major_head,
      minor_head: payload.minor_head,
      document_date: payload.document_date,
      document_remarks: payload.document_remarks,
      tags: payload.tags.map(t => ({ tag_name: t })),
      user_id: payload.user_id,
    }))
    const res = await uploadDocument(formData)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Upload failed')
  }
})

const uploadSlice = createSlice({
  name: 'upload',
  initialState: {
    tags: [],
    tagsLoading: false,
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetUpload(state) {
      state.loading = false
      state.success = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => { state.tagsLoading = true })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tagsLoading = false
        state.tags = action.payload.map(t => t.label || t.tag_name || t).filter(t => typeof t === 'string')
      })
      .addCase(fetchTags.rejected, (state) => { state.tagsLoading = false })
      .addCase(submitUpload.pending, (state) => { state.loading = true; state.error = null; state.success = false })
      .addCase(submitUpload.fulfilled, (state) => { state.loading = false; state.success = true })
      .addCase(submitUpload.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export const { resetUpload } = uploadSlice.actions
export default uploadSlice.reducer
