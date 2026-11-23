import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../utils/Config';

const REQUEST_TIMEOUT_MS = 60000;

const baseQueryWithTimeout = fetchBaseQuery({
     baseUrl: API_BASE_URL,
     timeout: REQUEST_TIMEOUT_MS,
});

export default baseQueryWithTimeout;
