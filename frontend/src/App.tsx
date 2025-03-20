import "./App.css";

import Login from "./pages/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Todos from "./pages/Todos";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/todos" element={<Todos />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
