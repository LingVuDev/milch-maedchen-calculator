# Investment Calculator

A modern investment calculator built with Next.js, TypeScript, and shadcn/ui that helps you plan and visualize long-term investment returns.

## Features

- 📊 **Investment Planning**: Calculate returns over multiple years with varying investment amounts and gain percentages
- 💰 **Flexible Inputs**: Customize monthly investments and yearly gain rates with dynamic period management
- 📈 **Detailed Results**: View year-by-year breakdown with tax calculations and summary statistics
- 💾 **Import/Export**: Save and load investment scenarios as JSON files
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Clean, professional interface with toast notifications

## Live Demo

Visit the live application: [https://lingvudev.github.io/milch-maedchen-calculator/](https://lingvudev.github.io/milch-maedchen-calculator/)

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn package manager

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/milch-maedchen-calculator.git
   cd milch-maedchen-calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Automatic Deployment

1. Push your code to the `main` branch
2. GitHub Actions will automatically build and deploy to GitHub Pages
3. Your site will be available at `https://yourusername.github.io/milch-maedchen-calculator/`

### Manual Deployment

If you prefer manual deployment:

```bash
npm run deploy
```

### Configuration

If your repository name is different from your desired URL path, update the `basePath` and `assetPrefix` in `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: '/your-repo-name',
  assetPrefix: '/your-repo-name/',
};
```

## Technology Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)
- **Development**: Biome for linting and formatting

## Project Structure

```
src/
├── app/                 # Next.js app router
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── InvestmentCalculator.tsx
├── lib/                # Utility functions
│   ├── utils.ts        # shadcn/ui utilities
│   └── investmentCalculations.ts # Business logic
└── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
