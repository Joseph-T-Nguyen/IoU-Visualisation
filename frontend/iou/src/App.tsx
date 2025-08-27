import {BrowserRouter, Routes, Route} from "react-router";
import LandingPage from "@/views/LandingPage/LandingPage.tsx"
import SignUpPage from "@/views/SignUpPage/SignUpPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
