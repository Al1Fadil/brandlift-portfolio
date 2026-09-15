# BrandLift Portfolio
Next.js/React portfolio for BrandLift, designed for Vercel.

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Deploy
Push this folder to GitHub and import the repository into Vercel, or run `npx vercel`.

## Updating projects
Edit `src/data/projects.ts` and place optimized assets in `public/assets/<project>/`.

## Contact form
The V1 form currently provides the designed front-end success flow. Before public launch, connect the submit handler in `src/components/ContactPanel.tsx` to your preferred form/email endpoint.
