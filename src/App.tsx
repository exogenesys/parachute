import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Footer from "./components/Footer";
import Header from "./components/Header";

import AirdropPage from "./pages/AirdropPage";
import HomePage from "./pages/HomePage";
import AddressFetcher from "./pages/AddressFetcher";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Header />
        <div className="pageContainer">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/airdrop" element={<AirdropPage />} />
            <Route path="/address-fetcher" element={<AddressFetcher />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
