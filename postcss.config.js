import tailwindcss from '@tailwindcss/postcss';

// PostCSS plugin to add !important to all Tailwind utilities
const addImportantToTailwind = {
  postcssPlugin: 'add-important-to-tailwind',
  Declaration(decl) {
    // Add !important to all declarations in Tailwind utilities
    // Skip if already has !important
    if (!decl.important && decl.parent?.selector) {
      const selector = decl.parent.selector;

      // Check if it's a Tailwind utility class (starts with . and is a single class)
      // or contains Tailwind-specific patterns
      const isTailwindUtility =
        /^\.[a-z-]+[a-z0-9-]*(?:\[.*?\])?$/.test(selector) || // .mt-4, .bg-[#fff]
        /^\.[a-z-]+[a-z0-9-]*:[a-z-]+/.test(selector) || // .hover:bg-blue-500
        /^\.[a-z-]+[a-z0-9-]*\\!/.test(selector) || // .mt-4\!
        selector.includes(':where('); // Already wrapped

      if (isTailwindUtility) {
        decl.important = true;
      }
    }
  },
};

export default {
  plugins: [
    tailwindcss,
    addImportantToTailwind,
  ],
}
