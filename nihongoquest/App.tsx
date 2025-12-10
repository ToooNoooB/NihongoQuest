
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import KanjiList from './pages/KanjiList';
import KanjiDetail from './pages/KanjiDetail';
import KanaList from './pages/KanaList';
import KanaDetail from './pages/KanaDetail';
import VocabularyList from './pages/VocabularyList';
import Quiz from './pages/Quiz';
import Progress from './pages/Progress';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import { storageService } from './services/storageService';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = storageService.getUser();
  if (!user || !user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        
        <Route path="/sets" element={
          <ProtectedRoute>
            <KanjiList />
          </ProtectedRoute>
        } />
        
        <Route path="/kanji/:id" element={
          <ProtectedRoute>
            <KanjiDetail />
          </ProtectedRoute>
        } />

        <Route path="/kana" element={
          <ProtectedRoute>
            <KanaList />
          </ProtectedRoute>
        } />

        <Route path="/kana/:id" element={
          <ProtectedRoute>
            <KanaDetail />
          </ProtectedRoute>
        } />

        <Route path="/vocabulary" element={
          <ProtectedRoute>
            <VocabularyList />
          </ProtectedRoute>
        } />
        
        <Route path="/quiz" element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        } />
        
        <Route path="/progress" element={
          <ProtectedRoute>
            <Progress />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
    </HashRouter>
  );
};

export default App;
