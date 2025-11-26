import React, {useEffect} from 'react';
import {Route, Routes} from "react-router";
import routes from "./routes/routes.jsx";
import useUserStore from "./store/user.js";
import {CircularProgress} from "@mui/material";
import {Toaster} from "react-hot-toast";

const App = () => {
    const {loadUser, isGetMeLoading} = useUserStore();

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />

            {isGetMeLoading ? (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100dvh',
                    }}
                >
                    <CircularProgress />
                </div>
            ) : (
                <Routes>
                    {routes.map(({path, element, children}, index) => (
                        <Route key={index} path={path} element={element}>
                            {children?.map(({path: childPath, element: childElement}, childIndex) => (
                                <Route key={childIndex} path={childPath} element={childElement} />
                            ))}
                        </Route>
                    ))}
                </Routes>
            )}
        </>
    );
};

export default App;