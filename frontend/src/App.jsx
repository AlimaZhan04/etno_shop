import routes from './routes/routes.jsx'
import {Routes, Route } from "react-router";

const App = () => {
    return (
        <>
            <Routes>
                {routes.map(({path, element, children}, index) => (
                    <Route key={index} path={path} element={element}>
                        {children?.map(({path: childPath, element: childElement}, childIndex) => (
                            <Route key={childIndex} path={childPath} element={childElement} />
                        ))}
                    </Route>
                ))}
            </Routes>
        </>
    );
};

export default App;