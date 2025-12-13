// We create a comment slice to centrally manage comment-related state and logic, making the application scalable, maintainable, and allowing multiple components to share consistent comment data.
import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
    name: "comment",
    initialState: {
        loading: false,
        comments: []   // 👈 MUST be an array
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setComment: (state, action) => {
            state.comments = action.payload;
        }
    }
});

export const { setLoading, setComment } = commentSlice.actions;
export default commentSlice.reducer;
