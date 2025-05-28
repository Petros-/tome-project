import React from 'react';
import './App.css'
import Container from './Container'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuthState } from "react-firebase-hooks/auth";
import ArtworkDetails from './art-pages/ArtworkDetails'
import NewArtwork from './art-pages/NewArtwork'
import EditArtwork from './art-pages/EditArtwork'
import EmailForm from "./auth/EmailForm";
import { auth } from "./FirebaseConfig"; 
import PropTypes from 'prop-types';
import { ArtworksProvider } from './art-pages/ArtworksContext';
import Loader from './fields/Loader';
import TagList from './tag-pages/TagList';
import TagDetails from './art-pages/TagDetails';

function ProtectedRoute({children}) {
  const [user] = useAuthState(auth)
  return user ? children : <Navigate to="/"/>;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, 
};

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
        <div className="flex items-center justify-center w-full h-full min-h-screen">
            <Loader />
        </div>
    )
}

  return (
    <>
      <ArtworksProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={user? <Container /> : <EmailForm />} />
            <Route path="/tags" element={<ProtectedRoute><TagList /></ProtectedRoute>} />
            <Route path="/tag/:id"element={<ProtectedRoute><TagDetails /></ProtectedRoute>} />
            <Route path="/artwork/:id" element={<ProtectedRoute><ArtworkDetails /></ProtectedRoute>} />
            <Route path="/new" element={<ProtectedRoute><NewArtwork /></ProtectedRoute>} />
            <Route path="/edit/:id" element={<ProtectedRoute><EditArtwork /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </ArtworksProvider>
    </>
  );
}

export default App;
