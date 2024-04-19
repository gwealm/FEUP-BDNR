import { useState } from 'react'
import './App.css'
import Home from './pages/Home.tsx'
import Bookmarks from './components/Bookmarks.tsx'
import { Header } from './components/Header.tsx'
import { Footer } from './components/Footer.tsx'

function App() {

  return (
    <>
        <Header title="Bookmark Manager" />
        <Bookmarks />
        <Footer />
    </>
  )
}

export default App
