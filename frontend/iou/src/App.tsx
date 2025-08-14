import {BrowserRouter, Routes, Route} from "react-router";
import LandingPage from "@/views/LandingPage/LandingPage.tsx"
import WorkspacesPage from "@/views/WorkspacesPage/WorkspacesPage.tsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/workspaces" element={<WorkspacesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
