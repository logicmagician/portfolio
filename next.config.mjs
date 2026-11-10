/** @type {import('next').NextConfig} */

// Set this to your repository name for a project site
// (https://USERNAME.github.io/REPOSITORY), or leave it as "" for a user site
// (https://USERNAME.github.io). The placeholder value disables the base path.
const repoName = "portfolio";

const isProd = process.env.NODE_ENV === "production";
const isConfigured = repoName !== "YOUR_GITHUB_REPOSITORY" && repoName !== "";
// Next.js rejects a basePath of "/" or one ending in "/", so a user site
// (repoName === "") must use no base path at all.
const basePath = isProd && isConfigured ? `/${repoName}` : "";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : "",
  // Lets client code build asset URLs that respect the GitHub Pages base path.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
