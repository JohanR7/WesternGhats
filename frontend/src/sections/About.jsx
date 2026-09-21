import Reveal from '../components/Reveal'

export default function About() {
  return (
    <div className="section-wrap ivory" id="about">
      <div className="inner">
        <div className="about-grid">
          <Reveal className="about-img-wrap">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/AnaimudiPeak_DSC_4834.jpg/1920px-AnaimudiPeak_DSC_4834.jpg"
              alt="Atmranya forest"
              loading="lazy"
            />
            <div className="about-img-cap">Atmranya, Kerala · UNESCO Biodiversity Hotspot</div>
          </Reveal>
          <Reveal delay={0.1} className="about-text">
            <div className="eyebrow">Our Purpose</div>
            <h2 className="display">
              A Heritage <br />
              No One Is <em>Protecting Yet</em>
            </h2>
            <div className="rule" />
            <div className="body-text">
              <p>
                Deep in the Atmranya, tribal communities carry centuries of forest
                knowledge — recipes, harvesting practices, and craft passed down through
                generations. Almost none of it has ever been documented, shared, or given the
                recognition it deserves.
              </p>
              <p>
                Atmranya is stepping in to change that. We are building a lasting effort to
                preserve this heritage, grounded in genuine relationships with the Kattunaikar
                and Kadar communities, guided by KIRTADS, and rooted in a UNESCO-designated
                biodiversity hotspot.
              </p>
              <p>
                This is not a product. It is a living archive — the first time this corner of
                India&rsquo;s most biodiverse landscape is being carefully documented, shared,
                and sustained for the communities who hold it and the generations who will
                inherit it.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
