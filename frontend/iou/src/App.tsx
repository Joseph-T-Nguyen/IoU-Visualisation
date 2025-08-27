import {BrowserRouter, Routes, Route} from "react-router";
import LandingPage from "@/views/LandingPage/LandingPage.tsx"
import LoginPage from "@/views/LoginPage/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
