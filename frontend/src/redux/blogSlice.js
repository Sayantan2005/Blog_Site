import { createSlice } from "@reduxjs/toolkit";


const blogSlice = createSlice({
    name:"blog",
    initialState:{
        loading:false,
        blogs:[]
    },
    reducers:{
        // actions
        setloading:(state,action)=>{
            state.loading = action.payload;
        },
        setBlog:(state,action)=>{
            state.blogs = action.payload;
        },
    }
})

export const {setloading,setBlog} = blogSlice.actions
export default blogSlice.reducer