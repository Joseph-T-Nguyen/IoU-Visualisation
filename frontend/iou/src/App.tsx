import {BrowserRouter, Routes, Route} from "react-router";
import ReactExampleView from "@/views/ReactExampleView/ReactExampleView.tsx"
import LandingPage from "@/views/LandingPage/LandingPage.tsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
      <Routes>
        <Route path="/react" element={<ReactExampleView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
