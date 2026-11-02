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

function Page() {
  const wp = useWordPress()
  useMotionEffects()

  return (
    <>
      <SvgDefs />
      <Nav />
      <main>
        <Hero />
        <Banner wp={wp.banner} />
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

export default function App() {
  return (
    <SiteProvider>
      <Page />
    </SiteProvider>
  )
}
