import { configureStore } from "@reduxjs/toolkit";

import { rootReducer } from "./root-reducers";

export const store = configureStore({ reducer: rootReducer });
