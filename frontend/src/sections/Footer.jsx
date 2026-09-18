import { useState } from 'react'

const LOGO_URL =
  'https://raw.githubusercontent.com/azure-2k4/WesternGhatsBrochure/d2edb106ea36ae4d9b6fe6ae23cf4fe9aaed42e4/Jun%2010%2C%202026%2C%2011_58_03%20AM.png'

export default function Footer() {
  const [logoError, setLogoError] = useState(false)

  return (
    <footer className="wg-footer">
      <div className="footer-inner">
        <div className="footer-left">
          {!logoError ? (
            <img
              src={LOGO_URL}
              alt="Western Ghats"
              className="footer-logo-img"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="footer-logo-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C8 2 4 5.5 4 10c0 3 1.5 5.5 4 7v3h8v-3c2.5-1.5 4-4 4-7 0-4.5-4-8-8-8zm0 2c3.3 0 6 2.7 6 6 0 2.3-1.2 4.3-3 5.5l-.8.5H9.8l-.8-.5C7.2 14.3 6 12.3 6 10c0-3.3 2.7-6 6-6z" />
                <path d="M10 7c0 2-2 4-2 4s2-.5 4-.5 4 .5 4 .5-2-2-2-4-1-1-2-1-2 0-2 1z" />
              </svg>
            </div>
          )}
          <div>
            <div className="footer-name">Western Ghats</div>
            <div className="footer-tag">&ldquo;Every purchase preserves a tradition.&rdquo;</div>
          </div>
        </div>
        <div className="footer-copy">© 2026 Western Ghats · Confidential Investor Document · Kerala, India</div>
      </div>
    </footer>
  )
}
