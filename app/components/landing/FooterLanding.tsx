// D:\BS-arena-NextJS\app\components\landing\FooterLanding.tsx
export default function FooterLanding() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-top">
          {/* Logo & Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-gem" />
              <span className="footer-logo-text">BS Arena</span>
            </div>
            <p className="footer-tagline">
              Built by IITM BS students,<br />for IITM BS students.
            </p>
          </div>

          {/* Navigation Grid */}
          <div className="footer-nav-grid">
            <div className="footer-nav-column">
              <h4 className="footer-nav-title">Platform</h4>
              <ul className="footer-nav-list">
                <li><a href="#" className="footer-link">Features</a></li>
                <li><a href="#" className="footer-link">Leaderboard</a></li>
                <li><a href="#" className="footer-link">Quizzes</a></li>
                <li><a href="#" className="footer-link">Practice</a></li>
              </ul>
            </div>

            <div className="footer-nav-column">
              <h4 className="footer-nav-title">Community</h4>
              <ul className="footer-nav-list">
                <li><a href="#" className="footer-link">Discord</a></li>
                <li><a href="#" className="footer-link">GitHub</a></li>
                <li><a href="#" className="footer-link">Contribute</a></li>
                <li><a href="#" className="footer-link">Blog</a></li>
              </ul>
            </div>

            <div className="footer-nav-column">
              <h4 className="footer-nav-title">Resources</h4>
              <ul className="footer-nav-list">
                <li><a href="#" className="footer-link">About</a></li>
                <li><a href="#" className="footer-link">Privacy</a></li>
                <li><a href="#" className="footer-link">Terms</a></li>
                <li><a href="#" className="footer-link">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <span>© {currentYear} BS Arena</span>
            <span className="copyright-divider">·</span>
            <span>Made for IITM BS students</span>
          </div>

          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Discord">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.5 13.5C9.5 14.3284 8.82843 15 8 15C7.17157 15 6.5 14.3284 6.5 13.5C6.5 12.6716 7.17157 12 8 12C8.82843 12 9.5 12.6716 9.5 13.5Z" fill="currentColor"/>
                <path d="M17.5 13.5C17.5 14.3284 16.8284 15 16 15C15.1716 15 14.5 14.3284 14.5 13.5C14.5 12.6716 15.1716 12 16 12C16.8284 12 17.5 12.6716 17.5 13.5Z" fill="currentColor"/>
                <path d="M19.5 4.5H4.5C3.67157 4.5 3 5.17157 3 6V18C3 18.8284 3.67157 19.5 4.5 19.5H19.5C20.3284 19.5 21 18.8284 21 18V6C21 5.17157 20.3284 4.5 19.5 4.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.839 21.489C9.339 21.581 9.5 21.27 9.5 21V19.31C6.726 19.891 6.14 17.967 6.14 17.967C5.67 16.855 4.998 16.555 4.998 16.555C4.078 15.958 5.073 15.97 5.073 15.97C6.098 16.045 6.637 17.02 6.637 17.02C7.526 18.45 8.97 18.012 9.54 17.77C9.63 17.1 9.889 16.636 10.175 16.37C7.955 16.12 5.62 15.27 5.62 11.5C5.62 10.39 6 9.5 6.65 8.79C6.55 8.52 6.2 7.5 6.75 6.15C6.75 6.15 7.59 5.88 9.5 7.17C10.29 6.95 11.15 6.84 12 6.84C12.85 6.84 13.71 6.95 14.5 7.17C16.41 5.88 17.25 6.15 17.25 6.15C17.8 7.5 17.45 8.52 17.35 8.79C18 9.5 18.38 10.39 18.38 11.5C18.38 15.28 16.04 16.11 13.81 16.36C14.17 16.69 14.5 17.33 14.5 18.31V21C14.5 21.27 14.66 21.59 15.17 21.49C19.14 20.16 22 16.42 22 12C22 6.477 17.523 2 12 2Z" fill="currentColor"/>
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 4.01C21 4.5 20.02 4.69 19 5C20.05 3.62 20.63 2.35 21 1C19.54 1.67 18.13 2.15 16.5 2.36C15.43 1.19 13.95 0.5 12.32 0.5C9.11 0.5 6.5 3.11 6.5 6.32C6.5 6.82 6.55 7.31 6.65 7.79C3.96 7.68 1.56 6.45 0 4.59C-0.46 5.44 -0.71 6.39 -0.71 7.38C-0.71 9.27 0.67 10.88 2.66 11.49C1.98 11.7 1.27 11.82 0.54 11.82C0.02 11.82 -0.48 11.77 -0.97 11.67C0.03 13.28 1.56 14.47 3.38 14.5C2.01 15.56 0.26 16.18 -1.5 16.18C-2 16.18 -2.5 16.14 -3 16.06C1.27 17.99 6.23 18.01 8.98 16.5C13.66 14.2 16.12 9.5 16.12 5.32C16.12 5.18 16.12 5.04 16.11 4.9C17.08 4.2 17.94 3.34 22 4.01Z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: #ffffff;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          padding: 60px 0 32px;
        }
        
        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
        }
        
        /* Top Section */
        .footer-top {
          display: grid;
          grid-template-columns: 1.5fr 2fr;
          gap: 80px;
          padding-bottom: 48px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }
        
        /* Brand Section */
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .footer-logo-gem {
          width: 10px;
          height: 10px;
          background: #c9a84c;
          transform: rotate(45deg);
          flex-shrink: 0;
          border-radius: 2px;
        }
        
        .footer-logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: #002147;
          letter-spacing: -0.02em;
        }
        
        .footer-tagline {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #7a7670;
          margin: 0;
        }
        
        /* Navigation Grid */
        .footer-nav-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }
        
        .footer-nav-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .footer-nav-title {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #002147;
          margin: 0;
        }
        
        .footer-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .footer-link {
          font-size: 0.9rem;
          color: #7a7670;
          text-decoration: none;
          transition: all 0.2s ease;
          display: inline-block;
        }
        
        .footer-link:hover {
          color: #002147;
          transform: translateX(4px);
        }
        
        /* Bottom Section */
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 32px;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .footer-copyright {
          font-family: 'DM Sans', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          color: #b8b3ab;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .copyright-divider {
          color: #d9d2cb;
        }
        
        .footer-social {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.02);
          color: #7a7670;
          transition: all 0.2s ease;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }
        
        .social-link:hover {
          background: #002147;
          color: #ffffff;
          transform: translateY(-2px);
          border-color: #002147;
        }
        
        /* ===== Responsive Design ===== */
        
        /* Tablet */
        @media (max-width: 1024px) {
          .footer-top {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          
          .footer-nav-grid {
            gap: 32px;
          }
        }
        
        /* Mobile */
        @media (max-width: 768px) {
          .footer {
            padding: 40px 0 24px;
          }
          
          .footer-container {
            padding: 0 24px;
          }
          
          .footer-top {
            padding-bottom: 32px;
          }
          
          .footer-nav-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px;
          }
          
          .footer-nav-column:last-child {
            grid-column: span 2;
          }
          
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 24px;
          }
          
          .footer-copyright {
            font-size: 0.7rem;
          }
          
          .social-link {
            width: 36px;
            height: 36px;
          }
        }
        
        /* Small Mobile */
        @media (max-width: 480px) {
          .footer-container {
            padding: 0 20px;
          }
          
          .footer-nav-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          
          .footer-nav-column:last-child {
            grid-column: auto;
          }
          
          .footer-nav-list {
            gap: 10px;
          }
          
          .footer-logo-text {
            font-size: 1.3rem;
          }
          
          .footer-tagline {
            font-size: 0.85rem;
          }
          
          .footer-bottom {
            padding-top: 24px;
          }
          
          .footer-social {
            width: 100%;
            justify-content: center;
          }
        }
        
        /* Hover animation for links */
        @media (min-width: 769px) {
          .footer-link {
            position: relative;
          }
          
          .footer-link::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 1px;
            background: #002147;
            transition: width 0.2s ease;
          }
          
          .footer-link:hover::after {
            width: 100%;
          }
        }
      `}</style>
    </footer>
  );
}