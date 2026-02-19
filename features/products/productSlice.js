import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


// const API = 'https://fakestoreapi.com/products'
const API = 'https://api.buywaterh2o.com/api/products'

// Fetch all products
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_,thunkAPI)=>{
     try {
        const res = await fetch(API)
        const data = res.json();
        return data
     } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
     }
    }
)


// Fetch Single products
export const fetchSingle = createAsyncThunk(
    'products/fetchSingle',
    async (id,thunkAPI)=>{
        try {
            const res = await fetch(`${API}/${id}`)
            const data = res.json()
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

const productSlice = createSlice({
    name:'products',
    initialState:{
        items:[],
         currentProduct:null,
        status:'idle', // loading, succeeded, failed
        error:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        // lifeCycle of the fetchProducts
        .addCase(fetchProducts.pending,(state,action)=>{
            state.status = 'loading',
            state.error = null
        })
        .addCase(fetchProducts.fulfilled,(state,action)=>{
            state.status = 'succeeded'
            state.items = action.payload
        })
        .addCase(fetchProducts.rejected, (state,action)=>{
            state.status = 'failed'
            state.error = action.payload
        })
        // lifeCycle of the fetchSingle
        // .addCase(fetchSingle.pending,(state)=>{
        //     state.status = 'loading'
        //     state.error = null
        // })
        // .addCase(fetchSingle.fulfilled,(state,action)=>{
        //     state.status = 'succeeded'
        //     state.currentProduct = action.payload

        // })
        // .addCase(fetchSingle.rejected, (state,action)=>{
        //     state.status = 'failed'
        //     state.error = action.payload
        // })
         // fetch one product
      .addCase(fetchSingle.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSingle.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentProduct = action.payload;
      })
      .addCase(fetchSingle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
    }
})

export default productSlice.reducer