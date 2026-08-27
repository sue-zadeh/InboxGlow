# Customization guide

## Brand and content

Edit `apps/web/src/config.ts`. It holds the business name, headline, description, email, phone, hours, location, and enquiry choices.

## Colours and typography

Edit the variables at the top of `apps/web/src/styles.css`:

```css
--ink: #07111f;
--mint: #68e0bd;
--blue: #6fa8ff;
```

The template uses DM Sans and Manrope from Google Fonts. For self-hosting, download the fonts, add them to `apps/web/public/fonts`, and update the `@font-face` rules.

## Form fields

When adding a field, update all three places:

1. `ContactForm.tsx` frontend schema and markup
2. `routes/contact.ts` server schema
3. `prisma/schema.prisma` database model, followed by a migration

This keeps browser, API, and database validation consistent.

## Email notifications

Messages are always stored in PostgreSQL. To add email delivery, connect Resend, Postmark, or your preferred provider inside the successful contact route after the database create call. Keep database storage as the source of truth so a temporary email failure never loses a lead.

## Marketplace demo mode

Set `VITE_DEMO_MODE="true"` only for a public static preview. The contact form and dashboard will work without a backend and keep sample messages in the visitor's local browser. Never enable demo mode for a customer's production site.
