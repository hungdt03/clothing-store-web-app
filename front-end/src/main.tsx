import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ConfigProvider } from 'antd'
import { GoogleOAuthProvider } from '@react-oauth/google'
import store from './app/store.ts'
import { Provider } from 'react-redux'
import NotificationProvider from './app/context/notification-fcm/notification-provider.tsx'

createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId={'793882401486-mf4hedmj9v6fek640dbda5n975uvolos.apps.googleusercontent.com'}>
        {/* <StrictMode> */}
        <ConfigProvider theme={{
            token: {
                colorPrimary: '#fb923c',
                fontFamily: "'Josefin Sans', sans-serif;"
            },
        }}>
            <Provider store={store} >
                <NotificationProvider>
                    <App />
                </NotificationProvider>
            </Provider>
        </ConfigProvider>
        {/* </StrictMode> */}
    </GoogleOAuthProvider>,
)
