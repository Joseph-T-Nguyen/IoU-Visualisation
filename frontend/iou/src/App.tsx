import {BrowserRouter, Routes, Route} from "react-router";
import LandingPage from "@/views/LandingPage/LandingPage.tsx"
import CreateNewWorkspacePage from "./views/CreateNewWorkspacePage/CreateNewWorkspacePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/workspaces/new" element={<CreateNewWorkspacePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
