// D:\BS-arena-NextJS\app\components\landing\ContactLanding.tsx
"use client";

import { useEffect, useRef, useState, useId } from "react";

export default function ContactLanding() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    roll: "",
    email: "",
    topic: "",
    message: "",
  });

  // Generate stable IDs for form fields
  const nameId = useId();
  const rollId = useId();
  const emailId = useId();
  const topicId = useId();
  const msgId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("on");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll(".r-l, .r-r");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    const fieldName = id.replace("f", "").toLowerCase();
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const newErrors: Record<string, boolean> = {};
    if (!formData.name) newErrors.name = true;
    if (!formData.email) newErrors.email = true;
    if (!formData.topic) newErrors.topic = true;
    if (!formData.message) newErrors.message = true;

    if (Object.keys(newErrors).length > 0) {
      // Shake the empty fields
      Object.keys(newErrors).forEach((field) => {
        const el = document.getElementById(`f${field}`) as HTMLElement;
        if (el) {
          el.style.borderColor = "#ff6b6b";
          el.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
          setTimeout(() => {
            el.style.borderColor = "";
            el.style.boxShadow = "";
          }, 2000);
        }
      });
      return;
    }

    setFormSubmitted(true);
  };

  // Don't render form fields until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <section id="contact" ref={sectionRef} className="contact-section">
        <div className="contact-container">
          <div className="r-l">
            <p className="section-eyebrow">// Get in Touch</p>
            <h2 className="section-heading">
              Questions?<br />
              <em>We're here.</em>
            </h2>
            <p className="contact-description">
              Built by IITM BS students, for IITM BS students. Have a bug to
              report, a feature to suggest, or just want to say hello — we read
              everything.
            </p>
            <div className="contact-info-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="contact-info-card-skeleton" />
              ))}
            </div>
          </div>
          <div className="r-r">
            <div className="contact-form-skeleton">
              <div className="contact-form-header">Send us a message</div>
              <div className="contact-form-body">
                <p className="contact-form-loading">Loading form...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" ref={sectionRef} className="contact-section">
      <div className="contact-container">
        
        {/* Left Column */}
        <div className="r-l">
          <p className="section-eyebrow">// Get in Touch</p>
          <h2 className="section-heading">
            Questions?<br />
            <em>We're here to help.</em>
          </h2>
          <p className="contact-description">
            Built by IITM BS students, for IITM BS students. Have a bug to
            report, a feature to suggest, or just want to say hello — we read
            everything.
          </p>
          
          {/* Contact Info Cards */}
          <div className="contact-info-grid">
            <div className="contact-info-card">
              <div className="contact-card-icon discord">💬</div>
              <div className="contact-card-content">
                <h3 className="contact-card-title">Discord Community</h3>
                <a href="#" className="contact-card-link">
                  discord.gg/bsarena
                </a>
              </div>
            </div>
            
            <div className="contact-info-card">
              <div className="contact-card-icon discord">📧</div>
              <div className="contact-card-content">
                <h3 className="contact-card-title">Email Us</h3>
                <a href="mailto:hello@bsarena.in" className="contact-card-link">
                  hello@bsarena.in
                </a>
              </div>
            </div>
            
            <div className="contact-info-card">
              <div className="contact-card-icon gold">🐛</div>
              <div className="contact-card-content">
                <h3 className="contact-card-title">Report a Bug</h3>
                <a href="#" className="contact-card-link">
                  github.com/bsarena
                </a>
              </div>
            </div>
            
            <div className="contact-info-card">
              <div className="contact-card-icon gold">⏱️</div>
              <div className="contact-card-content">
                <h3 className="contact-card-title">Response Time</h3>
                <span className="contact-card-text">
                  Within 24 hours
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="r-r">
          <div className="contact-form">
            <div className="contact-form-header">
              <span>Send us a message</span>
              <span className="form-badge">✨ We reply fast</span>
            </div>
            
            <div 
              className="contact-form-body"
              id="formBody"
              style={{ display: formSubmitted ? "none" : "block" }}
            >
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor={nameId}>
                    Your Name
                  </label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Ananya Krishnan"
                    id={nameId}
                    name="fname"
                    value={formData.name}
                    onChange={handleInputChange}
                    suppressHydrationWarning={true}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor={rollId}>
                    Roll No. (Optional)
                  </label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="DS21B001"
                    id={rollId}
                    name="froll"
                    value={formData.roll}
                    onChange={handleInputChange}
                    suppressHydrationWarning={true}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor={emailId}>
                  Email Address
                </label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="you@ds.study.iitm.ac.in"
                  id={emailId}
                  name="femail"
                  value={formData.email}
                  onChange={handleInputChange}
                  suppressHydrationWarning={true}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor={topicId}>
                  What's this about?
                </label>
                <select
                  className="form-select form-input"
                  id={topicId}
                  name="ftopic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  suppressHydrationWarning={true}
                >
                  <option value="" disabled>Select a topic</option>
                  <option>✨ Feature Request</option>
                  <option>🐛 Bug Report</option>
                  <option>❓ Question about BS Arena</option>
                  <option>🤝 Contribute / Collaborate</option>
                  <option>💡 Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor={msgId}>
                  Message
                </label>
                <textarea
                  className="form-textarea form-input"
                  placeholder="Tell us what's on your mind..."
                  id={msgId}
                  name="fmsg"
                  value={formData.message}
                  onChange={handleInputChange}
                  suppressHydrationWarning={true}
                  rows={4}
                ></textarea>
              </div>

              <div className="form-footer">
                <button className="btn-submit" onClick={handleSubmit}>
                  Send Message
                  <span className="btn-arrow">→</span>
                </button>
                <p className="form-footer-note">
                  We read every message · No spam, ever
                </p>
              </div>
            </div>

            {/* Success Message */}
            <div
              className="form-success"
              id="formSuccess"
              style={{ display: formSubmitted ? "flex" : "none" }}
            >
              <div className="success-animation">
                <div className="success-checkmark">✓</div>
              </div>
              <h3 className="form-success-title">Message sent!</h3>
              <p className="form-success-message">
                We'll get back to you within 24 hours. Meanwhile, go earn some XP.
              </p>
              <button 
                className="btn-reset"
                onClick={() => {
                  setFormSubmitted(false);
                  setFormData({
                    name: "",
                    roll: "",
                    email: "",
                    topic: "",
                    message: "",
                  });
                }}
              >
                Send another message
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-section {
          padding: 100px 0;
          background: #fafafa;
          position: relative;
          overflow: hidden;
        }
        
        .contact-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }
        
        /* ===== Left Column Styles ===== */
        .section-eyebrow {
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          color: #b8b3ab;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        
        .section-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 4vw, 3.8rem);
          font-weight: 300;
          line-height: 1.1;
          color: #002147;
          margin-bottom: 20px;
        }
        
        .section-heading em {
          font-style: italic;
          color: #7a7670;
        }
        
        .contact-description {
          font-size: 1rem;
          line-height: 1.7;
          color: #7a7670;
          margin: 0 0 40px 0;
          max-width: 500px;
        }
        
        /* Contact Info Cards Grid */
        .contact-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        
        .contact-info-card {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
        }
        
        .contact-info-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 33, 71, 0.08);
          border-color: rgba(0, 33, 71, 0.1);
        }
        
        .contact-card-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          flex-shrink: 0;
        }
        
        .contact-card-icon.discord {
          background: rgba(0, 33, 71, 0.08);
          color: #002147;
        }
        
        .contact-card-icon.gold {
          background: rgba(201, 168, 76, 0.08);
          color: #c9a84c;
        }
        
        .contact-card-content {
          flex: 1;
        }
        
        .contact-card-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #002147;
          margin-bottom: 4px;
        }
        
        .contact-card-link {
          font-size: 0.8rem;
          color: #7a7670;
          text-decoration: none;
          transition: color 0.2s;
          display: inline-block;
        }
        
        .contact-card-link:hover {
          color: #002147;
        }
        
        .contact-card-text {
          font-size: 0.8rem;
          color: #7a7670;
        }
        
        /* Skeleton loading */
        .contact-info-card-skeleton {
          height: 80px;
          background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 16px;
        }
        
        /* ===== Right Column Form Styles ===== */
        .contact-form {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
        }
        
        .contact-form-skeleton {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 24px;
          height: 500px;
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .contact-form-header {
          padding: 24px 32px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        
        .contact-form-header span:first-child {
          font-family: 'DM Sans', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          color: #002147;
          text-transform: uppercase;
          font-weight: 600;
        }
        
        .form-badge {
          font-size: 0.7rem;
          padding: 4px 12px;
          background: rgba(0, 33, 71, 0.06);
          border-radius: 100px;
          color: #002147;
          font-weight: 500;
        }
        
        .contact-form-body {
          padding: 32px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }
        
        .form-group:last-child {
          margin-bottom: 0;
        }
        
        .form-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #002147;
        }
        
        .form-input {
          background: #fafafa;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 12px;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          padding: 14px 16px;
          width: 100%;
          transition: all 0.2s ease;
        }
        
        .form-input:hover {
          border-color: rgba(0, 33, 71, 0.2);
        }
        
        .form-input:focus {
          border-color: #002147;
          box-shadow: 0 0 0 4px rgba(0, 33, 71, 0.08);
          background: #ffffff;
        }
        
        .form-select {
          appearance: none;
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237a7670' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 16px;
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 120px;
          line-height: 1.6;
        }
        
        .form-footer {
          margin-top: 32px;
        }
        
        .btn-submit {
          width: 100%;
          background: #002147;
          color: #ffffff;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          padding: 16px 24px;
          border-radius: 100px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .btn-submit:hover {
          background: #003366;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 33, 71, 0.2);
        }
        
        .btn-arrow {
          transition: transform 0.2s ease;
        }
        
        .btn-submit:hover .btn-arrow {
          transform: translateX(4px);
        }
        
        .form-footer-note {
          margin-top: 16px;
          text-align: center;
          font-size: 0.8rem;
          color: #b8b3ab;
        }
        
        /* Success State */
        .form-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 32px;
          text-align: center;
          gap: 20px;
        }
        
        .success-animation {
          margin-bottom: 8px;
        }
        
        .success-checkmark {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #002147;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          animation: scaleIn 0.3s ease;
        }
        
        .form-success-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 300;
          color: #002147;
        }
        
        .form-success-message {
          font-size: 1rem;
          color: #7a7670;
          max-width: 300px;
          line-height: 1.6;
        }
        
        .btn-reset {
          background: none;
          border: 1px solid rgba(0, 33, 71, 0.2);
          padding: 12px 24px;
          border-radius: 100px;
          font-size: 0.9rem;
          color: #002147;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 16px;
        }
        
        .btn-reset:hover {
          background: rgba(0, 33, 71, 0.04);
          border-color: #002147;
        }
        
        /* Animations */
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        
        /* ===== Responsive Design ===== */
        
        /* Tablet */
        @media (max-width: 1024px) {
          .contact-container {
            gap: 40px;
          }
          
          .contact-info-grid {
            grid-template-columns: 1fr;
          }
        }
        
        /* Mobile */
        @media (max-width: 768px) {
          .contact-section {
            padding: 60px 0;
          }
          
          .contact-container {
            grid-template-columns: 1fr;
            gap: 48px;
            padding: 0 20px;
          }
          
          .section-heading {
            font-size: 2.2rem;
          }
          
          .contact-description {
            margin-bottom: 32px;
          }
          
          .contact-info-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .contact-info-card {
            padding: 16px;
          }
          
          .contact-form-header {
            padding: 20px 24px;
          }
          
          .contact-form-body {
            padding: 24px;
          }
          
          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
            margin-bottom: 0;
          }
          
          .form-input {
            padding: 12px 14px;
            font-size: 16px; /* Prevents zoom on iOS */
          }
          
          .btn-submit {
            padding: 14px 20px;
          }
          
          .form-success {
            padding: 40px 24px;
          }
          
          .success-checkmark {
            width: 56px;
            height: 56px;
            font-size: 1.75rem;
          }
        }
        
        /* Small mobile */
        @media (max-width: 480px) {
          .contact-container {
            padding: 0 16px;
          }
          
          .contact-form-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .contact-info-card {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .contact-card-icon {
            width: 36px;
            height: 36px;
            font-size: 1.1rem;
          }
        }
      `}</style>
    </section>
  );
}