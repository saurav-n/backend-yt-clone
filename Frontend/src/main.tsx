import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Home from './components/home.tsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import LoginSignup from './components/loginSignup.tsx'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import WatchVideo from './components/watch.tsx'
import WatchHistoryPage from './components/watchHIstoryPage.tsx'
import VideoUploadPage from './components/VideoUploadPage.tsx'

const queryClient = new QueryClient()

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path='' element={<Home/>}/>
      <Route path='login-signup' element={<LoginSignup />} />
      <Route path='watch/:videoId' element={<WatchVideo/>}/>
      <Route path='history' element={<WatchHistoryPage/>}/>
      <Route path='uploadVideo' element={<VideoUploadPage/>}/>
    </Route>
  )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
