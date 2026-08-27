import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, LoaderCircle, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { siteConfig } from '../config'
import { sendContact } from '../lib/api'

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(80),
  email: z.string().trim().email('Please enter a valid email').max(160),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(100).optional(),
  enquiryType: z.string().min(1, 'Please choose a topic'),
  message: z.string().trim().min(10, 'Please add a little more detail').max(2000),
  website: z.string().max(0).optional(),
})

type FormData = z.infer<typeof schema>
type Notice = { type: 'success' | 'error'; text: string } | null

export default function ContactForm() {
  const [notice, setNotice] = useState<Notice>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormData) {
    setNotice(null)
    try {
      await sendContact(values)
      reset()
      setNotice({ type: 'success', text: 'Message sent. We will be in touch shortly.' })
    } catch (error) {
      setNotice({
        type: 'error',
        text: error instanceof Error ? error.message : 'Unable to send your message.',
      })
    }
  }

  const fieldError = (name: keyof FormData) => errors[name]?.message

  return (
    <motion.div
      className="form-card"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.15 }}
    >
      <div className="form-heading">
        <span>Start a conversation</span>
        <span className="secure-note"><Check size={14} /> Private & secure</span>
      </div>

      <AnimatePresence>
        {notice && (
          <motion.div
            role="status"
            className={`notice notice--${notice.type}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {notice.type === 'success' ? <Check size={18} /> : <X size={18} />}
            {notice.text}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-grid">
          <label>
            <span>Name *</span>
            <input {...register('name')} placeholder="Alex Morgan" autoComplete="name" aria-invalid={Boolean(errors.name)} />
            {fieldError('name') && <small>{fieldError('name')}</small>}
          </label>
          <label>
            <span>Email *</span>
            <input {...register('email')} type="email" placeholder="alex@company.com" autoComplete="email" aria-invalid={Boolean(errors.email)} />
            {fieldError('email') && <small>{fieldError('email')}</small>}
          </label>
          <label>
            <span>Phone</span>
            <input {...register('phone')} type="tel" placeholder="+64 21 000 0000" autoComplete="tel" />
          </label>
          <label>
            <span>Company</span>
            <input {...register('company')} placeholder="Your company" autoComplete="organization" />
          </label>
          <label className="full-width">
            <span>What can we help with? *</span>
            <select {...register('enquiryType')} defaultValue="" aria-invalid={Boolean(errors.enquiryType)}>
              <option value="" disabled>Select a topic</option>
              {siteConfig.enquiryTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
            {fieldError('enquiryType') && <small>{fieldError('enquiryType')}</small>}
          </label>
          <label className="full-width">
            <span>Message *</span>
            <textarea {...register('message')} rows={5} placeholder="Tell us about your idea, timeline, or question…" aria-invalid={Boolean(errors.message)} />
            {fieldError('message') && <small>{fieldError('message')}</small>}
          </label>
          <label className="honey" aria-hidden="true">
            Website
            <input {...register('website')} tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <button className="submit-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <><LoaderCircle className="spin" size={19} /> Sending</> : <>Send message <ArrowRight size={19} /></>}
        </button>
        <p className="privacy-copy">By sending this form, you agree to our <Link to="/privacy">privacy policy</Link>.</p>
      </form>
    </motion.div>
  )
}
