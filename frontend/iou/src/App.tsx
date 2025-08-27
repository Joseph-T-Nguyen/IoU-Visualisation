import {BrowserRouter, Routes, Route} from "react-router";
import LandingPage from "@/views/LandingPage/LandingPage.tsx"

import CreateNewWorkspacePage from "@/views/CreateNewWorkspacePage/CreateNewWorkspacePage";
import WorkspacePage from "@/views/WorkspacePage/WorkspacePage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/workspace" element={<WorkspacePage />} />
        <Route path="/workspaces/new" element={<CreateNewWorkspacePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
