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
import Listings from '../Listings/Listings';
import ViewListing from '../ViewListing/ViewListing';

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
          {/* Redirect root URL to /listings */}
          <Redirect exact from="/" to="/listings" />

          {/* Public Route for About Page */}
          <Route exact path="/about">
            <AboutPage />
          </Route>

          {/* Protected Route for Listings (All Listings) */}
          <ProtectedRoute exact path="/listings">
            <Listings />
          </ProtectedRoute>

          {/* Protected Route for Single Listing (Details of One Listing) */}
          <ProtectedRoute exact path="/listings/:id">
            <ViewListing />
          </ProtectedRoute>

          {/* Protected Route for My Listings */}
          <ProtectedRoute exact path="/mylistings">
            <MyListings />
          </ProtectedRoute>

          {/* Protected Route for Adding a Listing */}
          <ProtectedRoute exact path="/addlisting">
            <AddListing />
          </ProtectedRoute>

          {/* Protected Route for Editing a Listing */}
          <ProtectedRoute exact path="/edit/:id">
            <EditListing />
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

          {/* Public Route: Login Page */}
          <Route exact path="/login">
            {user.id ? <Redirect to="/listings" /> : <LoginPage />}
          </Route>

          {/* Public Route: Registration Page */}
          <Route exact path="/registration">
            {user.id ? <Redirect to="/listings" /> : <RegisterPage />}
          </Route>

          {/* Public Route: Landing Page */}
          <Route exact path="/home">
            {user.id ? <Redirect to="/listings" /> : <LandingPage />}
          </Route>

          {/* Catch-All Route for Undefined Routes (404) */}
          <Route>
            <h1>An error has occurred, Please contact support at 651-497-7491</h1>
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
