import {BrowserRouter, Routes, Route} from "react-router";
import LandingPage from "@/views/LandingPage/LandingPage.tsx"
import WorkspacesPage from "@/views/WorkspacesPage/WorkspacesPage.tsx"
import CreateNewWorkspacePage from "@/views/CreateNewWorkspacePage/CreateNewWorkspacePage.tsx";
import SignUpPage from "@/views/SignUpPage/SignUpPage";
import LoginPage from "@/views/LoginPage/LoginPage";
import WorkspacePage from "@/views/WorkspacePage/WorkspacePage.tsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/workspace" element={<WorkspacePage />} />
        <Route path="/workspaces" element={<WorkspacesPage />} />
        <Route path="/workspaces/new" element={<CreateNewWorkspacePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
