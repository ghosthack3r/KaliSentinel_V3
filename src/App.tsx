/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./contexts/SettingsContext";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import ThreatCenter from "./pages/ThreatCenter";
import Vault from "./pages/Vault";
import Authenticator from "./pages/Authenticator";
import AuthScreen from "./pages/AuthScreen";
import Settings from "./pages/Settings";
import Devices from "./pages/Devices";
import DevLab from "./pages/DevLab";
import { KaliTerminal } from "./components/ai/KaliTerminal";

// --- Development Flags ---
// Set this to `true` to bypass the AuthScreen during development.
const DEV_DISABLE_AUTH = true; 

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(DEV_DISABLE_AUTH);

  if (!isAuthenticated) {
    return <AuthScreen onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="threats" element={<ThreatCenter />} />
            <Route path="vault" element={<Vault />} />
            <Route path="auth" element={<Authenticator />} />
            <Route path="devices" element={<Devices />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/dev-lab" element={<DevLab />} />
        </Routes>
        <KaliTerminal />
      </BrowserRouter>
    </SettingsProvider>
  );
}
