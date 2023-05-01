import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Pages/Login";
import Register from "./components/Pages/Register";

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/messenger/login" element={<Login />} />
                    <Route path="/messenger/register" element={<Register />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
