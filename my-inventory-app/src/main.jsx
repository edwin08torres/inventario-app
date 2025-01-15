/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppRouter } from './routes/AppRouter';

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <AppRouter />
    </>
  );
}
