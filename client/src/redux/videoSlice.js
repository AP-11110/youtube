import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentVideo: null,
    loading: false,
    error: false
}

export const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: { // methods that can be called on the state
        fetchStart: (state) => {
            state.loading = true;
        },
        fetchSuccess: (state, action) => {
            state.loading = false;
            state.currentVideo = action.payload;
        },
        fetchFailure: (state) => {
            state.loading = false;
            state.error = true;
        },
        like: (state, action) => {
            if(!state.currentVideo.likes.includes(action.payload)){
                state.currentVideo.likes.push(action.payload);

                // removing dislike if exist
                state.currentVideo.dislikes.splice(
                    state.currentVideo.dislikes.findIndex((userId) => userId === action.payload), 1);
            }
        },
        dislike: (state, action) => {
            if(!state.currentVideo.dislikes.includes(action.payload)){
                state.currentVideo.dislikes.push(action.payload);

                // removing dislike if exist
                state.currentVideo.likes.splice(
                    state.currentVideo.likes.findIndex((userId) => userId === action.payload), 1);
            }
        }
        
    }
})

export const { fetchStart, fetchFailure, fetchSuccess, like, dislike } = videoSlice.actions;

export default videoSlice.reducer;