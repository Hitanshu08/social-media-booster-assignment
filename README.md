
  # Campaign Management Dashboard

  This is a code bundle for Campaign Management Dashboard. The original project is available at https://www.figma.com/design/DZHZLKpZ8fY936Fq9N2JZU/Campaign-Management-Dashboard.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## API

  By default, the frontend calls `http://127.0.0.1:3000`. To point at a different backend,
  set `VITE_API_BASE_URL` in a local `.env` file (for example,
  `VITE_API_BASE_URL=http://127.0.0.1:3000/api`).

  ## Deploy (GitHub Pages)

  The GitHub Actions workflow deploys automatically on push to `main`.
  Set the API URL in GitHub Actions variables:
  `Settings → Secrets and variables → Actions → Variables` and add
  `VITE_API_BASE_URL` (for example `https://your-backend.com/api`).
  