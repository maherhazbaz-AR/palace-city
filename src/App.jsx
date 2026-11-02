import { useCallback, useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Banner from './components/Banner'
import Walkthrough from './components/Walkthrough'
import Enquire from './components/Enquire'
import Highlights from './components/Highlights'
import About from './components/About'
import Villas, { PriceBand } from './components/Villas'
import { Advantages, Amenities, Testimonials } from './components/Features'
import Location from './components/Location'
import { Developer, Faq, Visit } from './components/Closing'
import Footer, { Dock, WhatsAppFloat } from './components/Footer'
import { SvgDefs } from './components/Ornaments'
import { SiteProvider } from './lib/site'
import { useMotionEffects } from './hooks/useMotionEffects'
import { useWordPress } from './hooks/useWordPress'
import { useBanner } from './hooks/useBanner'
import ThankYou from './components/ThankYou'
import Preloader from './components/Preloader'
import ErrorBoundary from './components/ErrorBoundary'
import { NotFound } from './components/StatusPage'
import { currentPath, isHomePath, routeFor, usePath } from './lib/route'

function Page({ revealed }) {
  const wp = useWordPress()
  const { status: bannerStatus, banner } = useBanner()
  useMotionEffects(revealed)

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Banner status={bannerStatus} wp={banner} />
        <Walkthrough />
        <Enquire />
        <Highlights items={wp.highlights} />
        <About />
        <Villas />
        <PriceBand />
        <Advantages />
        <Amenities />
        <Testimonials items={wp.testimonials} hidden={wp.testimonialsHidden} />
        <Location />
        <Developer />
        <Faq />
        <Visit />
      </main>
      <Footer />
      <Dock />
      <WhatsAppFloat />
    </>
  )
}

const VIEWS = {
  'thank-you': () => <ThankYou />,
  'not-found': () => <NotFound />,
}

export default function App() {
  const path = usePath()
  // The loading screen only covers the first visit to the home page; later in-app visits skip it.
  const [revealed, setRevealed] = useState(() => !isHomePath(currentPath()))
  const [booted, setBooted] = useState(() => !isHomePath(currentPath()))
  const reveal = useCallback(() => setRevealed(true), [])
  const finishBoot = useCallback(() => setBooted(true), [])
  const renderView = VIEWS[routeFor(path)]

  return (
    <SiteProvider>
      <SvgDefs />
      <ErrorBoundary resetKey={path}>
        {renderView ? renderView() : <Page revealed={revealed} />}
      </ErrorBoundary>
      {!booted && <Preloader onReady={reveal} onDone={finishBoot} />}
    </SiteProvider>
  )
}
