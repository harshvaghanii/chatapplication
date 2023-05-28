import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Pages/Login";
import Register from "./components/Pages/Register";
import Messenger from "./components/UI/Messenger";
import ProtectRoute from "./components/UI/ProtectRoute";

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectRoute>
                                <Messenger />
                            </ProtectRoute>
                        }
                    />
                    <Route path="/messenger/login" element={<Login />} />
                    <Route path="/messenger/register" element={<Register />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
