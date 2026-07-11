import React, { useEffect, useState } from 'react'
import logo from './logo.png'
import { PageContextProvider } from './usePageContext'
import type { PageContext } from './types'
import './PageShell.css'
import { Link } from './Link'
import { Provider, useDispatch, useSelector } from 'react-redux'
import store, { RootState } from '../store'
import Header from '../skeleton/Header'
import Footer from '../skeleton/Footer'
import { ThemeConfig } from 'flowbite-react'
import Breadcrumb from '../skeleton/Breadcrumb'
import { Cart } from '../screens/Cart'
import Login from '../screens/Login'
import { setLoginModalState, setSessionState, setToken, setUser } from '../features/auth/authSlice'
import { getAuth, onAuthStateChanged } from '@firebase/auth'
import { initializeApp } from '@firebase/app'
import AuthRepository from '../services/authRepository'
import { Checkout } from '../screens/Checkout'
import "./main.css";
import Alert from '../skeleton/Alert'


export { PageShell }

function PageShell({ children, pageContext }: { children: React.ReactNode; pageContext: PageContext }) {

  // const authState = useSelector((state: RootState) => state.auth);

  return (
    <React.StrictMode>
      <ThemeConfig mode='light' dark={false} />
      <Provider store={store}>
        <App />
        <PageContextProvider pageContext={pageContext}>
          <Layout>
            <Cart />
            <Checkout />
            <Header />
            <Login />
            <Alert />
            <Breadcrumb />
            <Content>{children}</Content>
            <Footer />
          </Layout>
        </PageContextProvider>
      </Provider>
    </React.StrictMode>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ minHeight: "70vh" }}>
      {children}
    </div>
  )
}

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div
    >
      {children}
    </div>
  )
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "70vh" }}>
      {children}
    </div>
  )
}

function App() {
  /**
   * Init configurations
   */
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    var queries = new URLSearchParams(window.location.search);
    var isLogin = queries.get("login");
    console.log("is login", isLogin);
    if (isLogin && isLogin == "true" && authState.sessionStarted && !authState.token) {
      dispatch(setLoginModalState({ showLoginPopup: true }));
    }

  }, [authState.sessionStarted]);

  // const firebaseConfig = {
  //   apiKey: "AIzaSyAgcsJWTmipo6it12EYtk8lW8kVMPXTSFU",
  //   authDomain: "www.mggadgets.in",
  //   projectId: "mg-test-cc86b",
  //   storageBucket: "mg-test-cc86b.firebasestorage.app",
  //   messagingSenderId: "189849778338",
  //   appId: "1:189849778338:web:ec8338217f87edfbdf7ffb"
  // };

  const firebaseConfig = {
    apiKey: "AIzaSyAdzIvesf9xOP1IvUZBr4apViYlJtthtOU",
    authDomain: "mg-gadgets.firebaseapp.com",
    projectId: "mg-gadgets",
    storageBucket: "mg-gadgets.firebasestorage.app",
    messagingSenderId: "59207995767",
    appId: "1:59207995767:web:f9406775b21aa5d37a9172",
    measurementId: "G-1REJX3FYYL"
  };


  initializeApp(firebaseConfig);

  const auth = getAuth();
  const authRepo = new AuthRepository();

  const getContext = async (token: string) => {
    const result = await authRepo.getAuthContext(token);
    if (result.status) {

      if (result.status == "DATA_FETCHED") {
        var data = result.data;
        if (data.length) {
          let user = data[0];
          dispatch(setUser({
            fullName: user.first_name,
            email: user.email,
            userType: "member",
            address: user.address,
            city: user.city,
            state: user.state,
            pincode: user.pincode
          }))
        }
      }
      return true;
    }

    return false;
  }

  onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      const token = await currentUser.getIdToken();
      // const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImVmMjQ4ZjQyZjc0YWUwZjk0OTIwYWY5YTlhMDEzMTdlZjJkMzVmZTEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbWctdGVzdC1jYzg2YiIsImF1ZCI6Im1nLXRlc3QtY2M4NmIiLCJhdXRoX3RpbWUiOjE3NTI1NjQxMDEsInVzZXJfaWQiOiJxU0xxb0xDUkpqWTgyM1c4YkEwMlFRUVEwSEMzIiwic3ViIjoicVNMcW9MQ1JKalk4MjNXOGJBMDJRUVFRMEhDMyIsImlhdCI6MTc1NjgyNzkxOSwiZXhwIjoxNzU2ODMxNTE5LCJwaG9uZV9udW1iZXIiOiIrOTE5NjY3NDM5Njc1IiwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJwaG9uZSI6WyIrOTE5NjY3NDM5Njc1Il19LCJzaWduX2luX3Byb3ZpZGVyIjoicGhvbmUifX0.e6_K7vWvXIiu7A7ecBC-h_nUXgEIkvQw3LhqRfqczP6nJR0edLPXKDWweZCgF9YEXC60dIcblLeZhjyMRZLTn87UgqjV0UOX3ApdW5cctNKBN9EkyvproGVNAc0pjvIV2cH3xXBubX7ZsIvyyoXPDlC5R3ojeQIZCqbgmjheAo2G6vgEjTymJdSHdiTAxhfEQnEABcC4qiqhH_z4Ojoobsf7K8I523mB-IDWUHMCNhDTUuWgToVHYctvta34NLzu1cuRRpdfoDnO2EQcVmm2eC6_mSMwX2E5ZDCTwR2IE_g74ynnjUYuI5ibqSAkdnrDCyRJsl08a1aacn-dBaZY8g";
      if (token) {
        // sync user context with backend
        await getContext(token);
        // dispatch token event
        dispatch(setToken({ token: token }));
      }
    }
 
    dispatch(setSessionState({ sessionState: true }));
  })

  return (<>
  </>);
}

function Logo() {
  return (
    <div
      style={{
        marginTop: 20,
        marginBottom: 10
      }}
    >
      <a href="/">
        <img src={logo} height={64} width={64} alt="logo" />
      </a>
    </div>
  )
}
