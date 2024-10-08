
import './App.css';
import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { publicRoutes } from './routers/routes'
import DefautLayout from './Layout/DefaultLayout/DefautLayout';

function App() {

  return (
    <div className="App">
      <Router>
        <div className="App">
          <Routes>

            {publicRoutes.map((route, index) => {
              let Layout = DefautLayout

              if (route.layout) {
                Layout = route.layout
              } else if (route.layout === null) {
                Layout = Fragment
              }

              const Page = route.component
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  } />
              )
            })}
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
