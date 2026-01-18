import { useState } from 'react';

import { Box } from '@mui/material';
// OUTLET used in parent route elements to render their child route elements.
// This allows nested UI to show up when child routes are rendered.
//BROWSER stores the current location in the browser's address bar using clean URLs 
//and navigates using the browser's built-in history stack.
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

//components
import DataProvider from './context/DataProvider';
import Header from './components/header/Header';
import Home from './components/home/Home';
import CreatePost from './components/create/CreatePost';
import DetailView from './components/details/DetailView';
import Update from './components/create/Update';
import Login from './components/account/Login';
import Profile from './components/profile/Profile';

const PrivateRoute = ({ isAuthenticated, isUserAuthenticated }) => {
  const token = sessionStorage.getItem('accessToken');
  return isAuthenticated && token ? 
    <>
      <Header isUserAuthenticated={isUserAuthenticated} />
      <Outlet />
    </> : <Navigate replace to='/account' />
};

function App() {

  const [isAuthenticated, isUserAuthenticated] = useState(sessionStorage.getItem('accessToken') ? true : false);

  return (
    <DataProvider>
      <BrowserRouter>
        <Box style={{ marginTop: 64 }}>
          <Routes>
            <Route path='/account' element={<Login isUserAuthenticated={isUserAuthenticated} />} />
            
            <Route path='/' element={<PrivateRoute isAuthenticated={isAuthenticated} isUserAuthenticated={isUserAuthenticated} />} >
              <Route path='/' element={<Home />} />
            </Route>

            <Route path='/create' element={<PrivateRoute isAuthenticated={isAuthenticated} isUserAuthenticated={isUserAuthenticated} />} >
              <Route path='/create' element={<CreatePost />} />
            </Route>

            <Route path='/details/:id' element={<PrivateRoute isAuthenticated={isAuthenticated} isUserAuthenticated={isUserAuthenticated} />} >
              <Route path='/details/:id' element={<DetailView />} />
            </Route>

            <Route path='/update/:id' element={<PrivateRoute isAuthenticated={isAuthenticated} isUserAuthenticated={isUserAuthenticated} />} >
              <Route path='/update/:id' element={<Update />} />
            </Route>

            <Route path='/profile/:username' element={<PrivateRoute isAuthenticated={isAuthenticated} isUserAuthenticated={isUserAuthenticated} />} >
              <Route path='/profile/:username' element={<Profile />} />
            </Route>
          </Routes>
        </Box>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;