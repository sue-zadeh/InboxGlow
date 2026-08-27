import { motion } from 'framer-motion'
import { ArrowUpRight, Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import ContactForm from '../components/ContactForm'
import { siteConfig } from '../config'

const details = [
  { icon: Mail, label: 'Email', value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { icon: Phone, label: 'Phone', value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s/g, '')}` },
  { icon: Clock3, label: 'Hours', value: siteConfig.hours },
  { icon: MapPin, label: 'Based in', value: siteConfig.location },
]

export default function ContactPage() {
  return (
    <main className="contact-shell">
      <div className="ambient ambient--one" />
      <div className="ambient ambient--two" />
      <nav className="topbar" aria-label="Main navigation">
        <Link className="brand" to="/" aria-label={`${siteConfig.brand} home`}>
          <span className="brand-mark">L</span>{siteConfig.brand}
        </Link>
        <div className="nav-actions"><span className="availability"><i /> Available for new projects</span><Link to="/admin">Dashboard</Link></div>
      </nav>

      <section className="contact-layout">
        <motion.div
          className="intro"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65 }}
        >
          <p className="eyebrow">{siteConfig.eyebrow}</p>
          <h1>{siteConfig.title}</h1>
          <p className="lede">{siteConfig.description}</p>

          <div className="contact-details">
            {details.map(({ icon: Icon, label, value, href }, index) => {
              const content = <><span className="detail-icon"><Icon size={20} /></span><span><small>{label}</small><strong>{value}</strong></span>{href && <ArrowUpRight className="detail-arrow" size={17} />}</>
              return href ? (
                <motion.a key={label} href={href} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 + index * 0.08 }}>{content}</motion.a>
              ) : (
                <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 + index * 0.08 }}>{content}</motion.div>
              )
            })}
          </div>

          <div className="trust-row">
            <div className="avatar-stack"><span>AM</span><span>JK</span><span>+8</span></div>
            <p><strong>Trusted by growing teams</strong><br />Friendly replies, never a sales script.</p>
          </div>
        </motion.div>
        <ContactForm />
      </section>
      <footer><span>© {new Date().getFullYear()} {siteConfig.brand}. Made with care.</span><span><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></span></footer>
    </main>
  )
}
