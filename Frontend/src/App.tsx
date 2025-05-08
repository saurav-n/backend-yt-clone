import { ErrorBoundary } from "react-error-boundary"
import Error from "./components/error"
import { Outlet } from "react-router"
import SideBar from "./components/sidebar"
import LoginSignup from "./components/loginSignup"


function App() {
  return(
    <main className="w-full flex justify-between">
      <ErrorBoundary FallbackComponent={Error}>
        <SideBar/>
        <Outlet/>
      </ErrorBoundary>
    </main>
  )
}

export default App
