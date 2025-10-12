import {BrowserRouter, Routes, Route} from "react-router";
import LandingPage from "@/views/LandingPage/LandingPage.tsx"
import WorkspacesPage from "@/views/WorkspacesPage/WorkspacesPage.tsx"
import WorkspacePage from "@/views/WorkspacePage/WorkspacePage.tsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/workspace/:id" element={<WorkspacePage />} />
        <Route path="/workspaces" element={<WorkspacesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
