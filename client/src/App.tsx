import { Routes, Route } from "react-router-dom";
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import HomeView from "./views/HomeView";
import GatewaysView from "./views/GatewaysView";
import PeripheralDevicesView from "./views/PeripheralDevicesView";
import Header from "./components/Header";

function App() {
  return (
    <div>
      <Header />
      <div style={{ marginTop: 50 }}>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/gateways" element={<GatewaysView />} />
          <Route
            path="/peripheral-devices"
            element={<PeripheralDevicesView />}
          />
        </Routes>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default App;
