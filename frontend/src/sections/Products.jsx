import Reveal from '../components/Reveal'
import RevealGroup from '../components/RevealGroup'
import { useCart } from '../context/CartContext'

const PICKLES = [
  {
    id: 'pickle-mango',
    name: 'Wild Mango Pickle',
    size: '250 ml',
    price: 379,
    image: '/products/pickles/mango%20pickle.webp',
  },
  {
    id: 'pickle-ginger',
    name: 'Wild Ginger Pickle',
    size: '250 ml',
    price: 399,
    image: '/products/pickles/ginger%20pickle.webp',
  },
  {
    id: 'pickle-bamboo',
    name: 'Wild Bamboo Pickle',
    size: '250 ml',
    price: 399,
    image: '/products/pickles/bamboo%20pickle.webp',
  },
]

const HONEY = [
  {
    id: 'honey-normal',
    name: 'Normal Honey',
    size: '250 ml',
    price: 479,
    image: '/products/honey/natural%20honey.webp',
  },
  {
    id: 'honey-tulsi',
    name: 'Tulsi Honey',
    size: '250 ml',
    price: 499,
    image: '/products/honey/tulsi%20honey.webp',
  },
  {
    id: 'honey-ginger',
    name: 'Ginger Honey',
    size: '250 ml',
    price: 499,
    image: '/products/honey/ginger%20honey.webp',
  },
]

const DISCOVERY = [
  {
    id: 'discovery-honey',
    name: 'Honey Discovery Set',
    desc: 'Ginger + Tulsi + Normal Honey',
    size: '3 × 70 ml',
    price: 449,
    image: '/products/discover/honey%20discover%20pack.webp',
  },
  {
    id: 'discovery-pickle',
    name: 'Pickle Discovery Set',
    desc: 'Bamboo + Mango + Ginger Pickle',
    size: '3 × 70 ml',
    price: 349,
    image: '/products/discover/discoveryset%20pickle.webp',
  },
]

function ProductCard({ id, name, desc, size, price, image }) {
  const { addItem } = useCart()

  return (
    <div className="p-card">
      <div className="p-img-wrap">
        <img className="p-img" src={image} alt={name} loading="eager" />
      </div>
      <div className="p-card-body">
        <h4>{name}</h4>
        {desc && <p>{desc}</p>}
        <div className="p-card-meta">
          <span className="p-card-size">{size}</span>
          <span className="p-card-price">₹{price}</span>
        </div>
        <button
          type="button"
          className="p-add-btn"
          onClick={() => addItem({ id, name, size, price, image })}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default function Products() {
  return (
    <div className="section-wrap cream" id="products">
      <div className="inner">
        <Reveal>
          <div className="eyebrow">Heritage Collection</div>
          <h2 className="display">
            Three Living Traditions.
            <br />
            <em>One Growing Archive.</em>
          </h2>
          <div className="rule" />
          <p className="body-text">
            Each collection builds on the trust, relationships, and craft of the one before it
            — widening the circle of traditions we can help preserve, and the number of
            families whose knowledge is honoured.
          </p>
        </Reveal>

        <RevealGroup className="product-grid" y={20} style={{ marginTop: 48 }}>
          {PICKLES.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </RevealGroup>

        <RevealGroup className="product-grid" y={20} style={{ marginTop: 20 }}>
          {HONEY.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </RevealGroup>

        <Reveal as="h3" className="discovery-title">
          Discovery Set
        </Reveal>
        <RevealGroup className="product-grid discovery" y={20}>
          {DISCOVERY.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </RevealGroup>
      </div>
    </div>
  )
}
