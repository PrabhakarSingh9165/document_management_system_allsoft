import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { searchDocuments } from '../../utils/api'

export const fetchDocuments = createAsyncThunk('search/fetch', async (params, { rejectWithValue }) => {
  try {
    const res = await searchDocuments(params)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Search failed')
  }
})

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    results: [],
    total: 0,
    loading: false,
    error: null,
    filters: {
      major_head: '',
      minor_head: '',
      from_date: '',
      to_date: '',
      tags: [],
      uploaded_by: '',
      search: { value: '' },
    },
    start: 0,
    length: 10,
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload }
      state.start = 0
    },
    setPage(state, action) { state.start = action.payload },
    clearFilters(state) {
      state.filters = { major_head: '', minor_head: '', from_date: '', to_date: '', tags: [], uploaded_by: '', search: { value: '' } }
      state.start = 0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false
        // Handle various response shapes
        const d = action.payload
        state.results = d?.data || d?.documents || d?.recordsData || []
        state.total = d?.recordsTotal || d?.total || state.results.length
      })
      .addCase(fetchDocuments.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export const { setFilters, setPage, clearFilters } = searchSlice.actions
export default searchSlice.reducer
