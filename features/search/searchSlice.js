import { createSlice } from '@reduxjs/toolkit'

const searchSlice = createSlice({
    name:'filter',
    initialState:{
        searchItem:''
    },
    reducers:{
        setSearchItem:(state,actions)=>{
        state.searchItem = actions.payload
    }
    }
})

export const {setSearchItem} = searchSlice.actions
export default searchSlice.reducer