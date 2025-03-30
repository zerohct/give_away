import { AppProps } from 'next/app';
import '../styles/main.css';
import '../styles/Sidebar.css';
import '../styles/Footer.css';
import '../styles/styles.css';
import '../styles/register.css';
import Footer from '../components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Đảm bảo bạn đã import CSS

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;