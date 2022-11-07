import '../styles/globals.css'
import { SWRConfig } from 'swr'
import Layout from '../components/Layout'
import fetcher from '../utils/fetcher'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function MyApp ({ Component, pageProps }) {
  return (
    <SWRConfig value={{ fetcher }}>
      <Layout>
        <Component {...pageProps} />
        <ToastContainer />
      </Layout>
    </SWRConfig >
  )
}

export default MyApp
