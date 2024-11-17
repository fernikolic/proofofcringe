import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  databaseURL: 'https://proof-of-cringe-72a1a-default-rtdb.firebaseio.com'
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);