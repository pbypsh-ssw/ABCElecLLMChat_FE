import { combineReducers } from '@reduxjs/toolkit'
import { chatReducer } from '../../features/chat'

export const rootReducer = combineReducers({
  chat: chatReducer,
})
