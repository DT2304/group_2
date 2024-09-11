
import './App.css';
import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { publicRoutes } from './routers/routes'
import DefautLayout from './Layout/DefaultLayout/DefautLayout';
import axios from "axios";

function App() {

  const as = () => {
    axios.get('http://127.0.0.1:5000/products')
      .then(response => {
        console.log( response);
        console.log( response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }
  as()
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
