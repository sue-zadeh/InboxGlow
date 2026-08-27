import { siteConfig } from '../config'
import { Link } from 'react-router-dom'

const content = {
  privacy: {
    title: 'Privacy policy',
    intro: 'This starter policy must be reviewed and customised for your business, services, and local privacy laws before launch.',
    sections: [
      ['Information we collect', 'When you contact us, we collect the details you enter in the form, such as your name, email, phone number, company, enquiry topic, and message.'],
      ['How we use it', 'We use this information to respond to your enquiry, provide requested services, protect the website, and keep appropriate business records.'],
      ['Storage and sharing', 'Enquiries are stored securely and are available only to authorised staff. We do not sell personal information. We share it only with service providers needed to operate this website or when required by law.'],
      ['Your choices', `You may ask to access, correct, or delete your personal information by contacting ${siteConfig.email}.`],
    ],
  },
  terms: {
    title: 'Website terms',
    intro: 'These starter terms must be reviewed and customised for your business and local laws before launch.',
    sections: [
      ['Using this website', 'Use this website lawfully and do not attempt to disrupt, misuse, or gain unauthorised access to it or its systems.'],
      ['Website information', 'We aim to keep information accurate and current, but general website content is not a binding quote, warranty, or professional advice.'],
      ['Intellectual property', 'Unless stated otherwise, the website content, design, branding, and original materials belong to the website owner and may not be republished without permission.'],
      ['Contact', `Questions about these terms can be sent to ${siteConfig.email}.`],
    ],
  },
} as const

export default function LegalPage({ type }: { type: keyof typeof content }) {
  const page = content[type]
  return (
    <main className="legal-page">
      <Link className="brand" to="/"><span className="brand-mark">L</span>{siteConfig.brand}</Link>
      <article>
        <p className="eyebrow">Last updated: 27 August 2026</p>
        <h1>{page.title}</h1>
        <p className="legal-intro">{page.intro}</p>
        {page.sections.map(([title, text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}
      </article>
      <Link className="legal-back" to="/">← Back to contact page</Link>
    </main>
  )
}
