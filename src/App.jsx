import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import OverViewPage from "./pages/OverViewPage";
import MinistryPage from "./pages/MinistryPage";
import DGMessagePage from "./pages/DGMessagePage";
import DivisionPage from "./pages/DivisionPage";
import MapOfSriLanka from "./pages/MapOfSriLanka";
import Admin from "./pages/admin";
import Login from "./pages/LoginPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import DivisionDetailPage from "./pages/DivisionDetailPage";
import DistrictDetailPage from "./pages/DistrictDetailPage";
import LinkTablePage from "./pages/LinkTablePage";
import NormalPage from "./pages/NormalPage";
import DirectLinkRedirect from "./pages/DirectLinkRedirect";
import DownloadLinkTablePage from "./pages/DownloadLinkTablePage";
import DownloadNormalPage from "./pages/DownloadNormalPage";
import DownloadDirectLinkRedirect from "./pages/DownloadDirectLinkRedirect";
import OfficerDirectLinkRedirect from "./pages/OfficerDirectLinkRedirect";
import OfficerLinkTablePage from "./pages/OfficerLinkTablePage";
import OfficerNormalPage from "./pages/OfficerNormalPage";
import TenderNormalPage from "./pages/TenderNormalPage";
import TenderDirectLinkRedirect from "./pages/TenderDirectLinkRedirect";
import TenderLinkTablePage from "./pages/TenderLinkTablePage";
import PeoplePage from "./pages/PeoplePage";
import RegulationsPage from "./pages/RegulationsPage";
import ByCatchRelese from "./pages/ByCatchReleasePage";
import { ToastContainer } from "react-toastify";
import { i } from "framer-motion/client";

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about/overview" element={<OverViewPage />} />
        <Route path="/about/ministry" element={<MinistryPage />} />
        <Route path="/about/Director General" element={<DGMessagePage />} />
        <Route path="/about/division" element={<DivisionPage />} />
        <Route path="/about/map" element={<MapOfSriLanka />} />
        <Route path="/divisions/:id" element={<DivisionDetailPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/districts/:id" element={<DistrictDetailPage />} />

        <Route path="/page/table/:slug" element={<LinkTablePage />} />
        <Route path="/page/normal/:slug" element={<NormalPage />} />
        <Route path="/page/direct/:id" element={<DirectLinkRedirect />} />

        <Route
          path="/download/table/:slug"
          element={<DownloadLinkTablePage />}
        />
        <Route path="/download/normal/:slug" element={<DownloadNormalPage />} />
        <Route
          path="/download/direct/:id"
          element={<DownloadDirectLinkRedirect />}
        />

        <Route path="/officer/table/:slug" element={<OfficerLinkTablePage />} />
        <Route path="/officer/normal/:slug" element={<OfficerNormalPage />} />
        <Route
          path="/officer/direct/:id"
          element={<OfficerDirectLinkRedirect />}
        />

        <Route path="/tender/table/:slug" element={<TenderLinkTablePage />} />
        <Route path="/tender/normal/:slug" element={<TenderNormalPage />} />
        <Route
          path="/tender/direct/:id"
          element={<TenderDirectLinkRedirect />}
        />

        <Route path="/Contact Details" element={<PeoplePage />} />
        <Route path="/regulations" element={<RegulationsPage />} />
        <Route path="/bycatch-release" element={<ByCatchRelese />} />
      </Routes>
    </Router>
  );
}

export default App;
