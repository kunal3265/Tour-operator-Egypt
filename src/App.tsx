import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useEffect } from 'react'
import { BrowserRouter, HashRouter, Route, Routes, useLocation } from 'react-router'

import { Footer } from './components/Footer'
import { ToastProvider } from './components/Toast'
import { StoreProvider } from './lib/store'
import { Book } from './pages/Book'
import { Contact } from './pages/Contact'
import { DestinationPage } from './pages/Destination'
import { Destinations } from './pages/Destinations'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Reviews } from './pages/Reviews'
import { Styleguide } from './pages/Styleguide'
import { TourPage } from './pages/Tour'
import { Tours } from './pages/Tours'
import { Trips } from './pages/Trips'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) return void setTimeout(() => el.scrollIntoView(), 380)
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])
  return null
}

function Pages() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        id="main"
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1"
      >
        <Routes location={location}>
          <Route index element={<Home />} />
          <Route path="tours" element={<Tours />} />
          <Route path="tours/:slug" element={<TourPage />} />
          <Route path="book/:slug" element={<Book />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="destinations/:slug" element={<DestinationPage />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="contact" element={<Contact />} />
          <Route path="trips" element={<Trips />} />
          <Route path="styleguide" element={<Styleguide />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  )
}

// A file:// page has no server to resolve /tours, so use hash routes there.
const Router = window.location.protocol === 'file:' ? HashRouter : BrowserRouter

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Router>
        <StoreProvider>
          <ToastProvider>
            <ScrollToTop />
            <a href="#main" className="sr-only z-[100] rounded-full bg-ink px-5 py-3 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
              Skip to content
            </a>
            <div className="flex min-h-svh flex-col">
              <Pages />
              <Footer />
            </div>
          </ToastProvider>
        </StoreProvider>
      </Router>
    </MotionConfig>
  )
}
