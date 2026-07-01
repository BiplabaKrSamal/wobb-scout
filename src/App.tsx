import { HashRouter, Route, Routes } from "react-router-dom";
import { SearchPage } from "@/pages/SearchPage";
import { ProfileDetailPage } from "@/pages/ProfileDetailPage";

// hash router so refreshing /profile/:key doesn't 404 on github pages
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/profile/:key" element={<ProfileDetailPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
