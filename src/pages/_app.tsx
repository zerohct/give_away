import "../styles/globals.css";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import { AuthProvider } from "../context/AuthContext";
import { UserProvider } from "../context/UserContext"; // Thêm import này
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "../components/layouts/MainLayout";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith("/admin");

  return (
    <AuthProvider>
      <UserProvider> {/* Bao bọc ứng dụng bằng UserProvider */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        {isAdminPage ? (
          <Component {...pageProps} />
        ) : (
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        )}
      </UserProvider>
    </AuthProvider>
  );
}

export default MyApp;
