# Lapiez Solution (E-Commerce Platform)

## 🌐 Production Live Domains
- **Live Store:** [https://www.lapiez.com](https://www.lapiez.com) (or [https://lapiez.com](https://lapiez.com))
- **Production Vercel Domain:** [https://lappy-solution.vercel.app](https://lappy-solution.vercel.app)
- **Live Admin Panel:** [https://www.lapiez.com/admin](https://www.lapiez.com/admin) or [https://lappy-solution.vercel.app/admin](https://lappy-solution.vercel.app/admin)

## 🚀 One-Command Live Deployment
To deploy changes live to production and verify health across both domains:
```bash
npm run live
```
This automatically commits changes, pushes to `origin master` (triggering Vercel CI/CD for `www.lapiez.com` and `lappy-solution.vercel.app`), and runs automated health checks.

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
