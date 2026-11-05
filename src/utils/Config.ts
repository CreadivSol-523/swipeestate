import Config from 'react-native-config';

const FALLBACK_URL = 'https://swipeestatebackend.vercel.app';

const rawUrl = (Config.API_BASE_URL || FALLBACK_URL).trim().replace(/\/+$/, '');

// react-native-config returns the value exactly as written in .env, so a URL
// saved without a scheme (e.g. "swipeestatebackend.vercel.app") is not a valid
// request target. Add https:// when the scheme is missing.
// const API_BASE_URL = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
const API_BASE_URL = 'http://192.168.0.102:5000';

export default API_BASE_URL;
