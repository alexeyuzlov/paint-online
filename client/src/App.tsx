import React from 'react';
import "./styles/app.css"
import {BrowserRouter, Routes, Route, Navigate, useParams} from 'react-router-dom'
import DrawingScreen from "./components/DrawingScreen";
import appState from "./store/app.state";
import authState from "./store/auth.state";

const App = () => {
    const urlParams = useParams();

    appState.init();
    authState.setSessionId(urlParams.id!);

    return (
        <BrowserRouter>
            <div className="app">
                <Routes>
                    <Route
                        path='/:id'
                        element={<DrawingScreen></DrawingScreen>}
                    />
                    <Route
                        path="*"
                        element={<Navigate to={`f${(+new Date()).toString(16)}`} replace />}
                    />
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;
