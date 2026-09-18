import CartButton from './components/CartButton'
import CartDrawer from './components/CartDrawer'
import TaglineBanner from './components/TaglineBanner'
import { CartProvider } from './context/CartContext'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import About from './sections/About'
import Community from './sections/Community'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import Hero from './sections/Hero'
import Operations from './sections/Operations'
import Products from './sections/Products'
import StatsBand from './sections/StatsBand'
import SupplyChain from './sections/SupplyChain'
import Vision from './sections/Vision'

function PageRule() {
  return <div className="page-rule" />
}

function App() {
  useSmoothScroll()

  return (
    <CartProvider>
      <div className="wg-page">
        <Hero />
        <StatsBand />
        <About />
        <PageRule />

        <TaglineBanner variant="cream">
          Become an <em>early steward</em> of India&rsquo;s first initiative to preserve
          forest-origin heritage — its recipes, its craft, and the communities who keep it
          alive.
        </TaglineBanner>

        <Vision />
        <Products />
        <PageRule />

        <Community />
        <PageRule />

        <TaglineBanner variant="cream">
          Create <em>lasting cultural impact</em> while supporting tribal communities, ethical
          sourcing, and the preservation of traditional heritage.
        </TaglineBanner>

        <Operations />
        <PageRule />

        <SupplyChain />

        <Contact />
        <Footer />
      </div>

      <CartButton />
      <CartDrawer />
    </CartProvider>
  )
}

export default App
