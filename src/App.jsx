import { BrowserRouter as Router } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans">
        <Layout />
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="mt-16"
        />
      </div>
    </Router>
  )
}

export default App