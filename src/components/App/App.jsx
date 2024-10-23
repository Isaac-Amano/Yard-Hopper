import React, { useEffect } from 'react';

import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import ImageUpload from '../ImageUpload/ImageUpload';
import ViewListings from '../ViewListings/ViewListings';
import MyListings from '../MyListings/MyListings';
import AddListing from '../AddListing/AddListing';
import EditListing from '../EditListing/EditListing';  


import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

import AboutPage from '../AboutPage/AboutPage';
import UserPage from '../UserPage/UserPage';
import InfoPage from '../InfoPage/InfoPage';
import LandingPage from '../LandingPage/LandingPage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';


// Inside the Switch component
<ProtectedRoute exact path="/mylistings">
  <MyListings />
</ProtectedRoute>


import './App.css';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  useEffect(() => {
    dispatch({ type: 'FETCH_USER' });
  }, [dispatch]);

  return (
    <Router>
      <div>
        <Nav />
        <Switch>
          {/* Redirect root URL to /home */}
          <Redirect exact from="/" to="/home" />

          {/* Public Route for About Page */}
          <Route exact path="/about">
            <AboutPage />
          </Route>

          {/* Protected Route for  View Listings */}
          <ProtectedRoute exact path="/listings">
            <ViewListings />
          </ProtectedRoute>

          <ProtectedRoute exact path="/mylistings">
          <MyListings />
      </ProtectedRoute>

          <ProtectedRoute exact path="/addlisting">
            <AddListing />
          </ProtectedRoute>

          {/* Protected Route: User Page */}
          <ProtectedRoute exact path="/user">
            <UserPage />
          </ProtectedRoute>

          {/* Protected Route: Info Page */}
          <ProtectedRoute exact path="/info">
            <InfoPage />
          </ProtectedRoute>

          {/* Protected Route: Image Upload */}
          <ProtectedRoute exact path="/upload">
            <ImageUpload />
          </ProtectedRoute>
            
          <ProtectedRoute exact path="/edit/:id">  
            <EditListing />
          </ProtectedRoute>
          {/* Public Route: Login Page */}
          <Route exact path="/login">
            {user.id ? <Redirect to="/user" /> : <LoginPage />}
          </Route>

          {/* Public Route: Registration Page */}
          <Route exact path="/registration">
            {user.id ? <Redirect to="/user" /> : <RegisterPage />}
          </Route>

          {/* Public Route: Landing Page */}
          <Route exact path="/home">
            {user.id ? <Redirect to="/user" /> : <LandingPage />}
          </Route>
         
          {/* 404 Page */}
          <Route>
            <h1>An error has occured, Please contact support</h1>
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
