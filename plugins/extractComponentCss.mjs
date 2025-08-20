import core from './extractCssCore.cjs';
const {parseComponentCSS} = core;

// Custom plugin to extract CSS per component and add imports
export const extractComponentCSS = () => {
	const cssContentMap = new Map();

	return {
		name: 'extract-component-css',
		buildStart() {
			cssContentMap.clear();
		},
		generateBundle(options, bundle) {
			// First pass: collect CSS content from the main CSS file
			let mainCSSContent = '';
			Object.keys(bundle).forEach((fileName) => {
				if (fileName === 'index.css' && bundle[fileName].type === 'asset') {
					mainCSSContent = bundle[fileName].source;
					// Remove the main CSS file as we'll split it
					delete bundle[fileName];
				}
			});

			if (!mainCSSContent) return;

			// Parse CSS and group by component (ComponentName::local-block)
			const componentCSS = parseComponentCSS(mainCSSContent);

			// Second pass: add CSS imports to components and create individual CSS files
			Object.keys(bundle).forEach((fileName) => {
				const chunk = bundle[fileName];
				if (chunk.type === 'chunk' && fileName.endsWith('.js')) {
					// Match any component under components/..., infer component name from filename
					// Examples:
					// components/Logo/Logo.js      -> Logo
					// components/CompositeBar/Item/Item.js -> Item
					const componentMatch = fileName.match(/components\/(?:.*\/)?([^\/]+)\.js$/);
					if (componentMatch) {
						const componentName = componentMatch[1];
						const cssFileName = fileName.replace('.js', '.css');

						// Try to disambiguate by local block derived from path, e.g. components/MobileHeader/FooterItem/FooterItem.js
						// → local "gn-mobile-header-footer-item"; components/FooterItem/FooterItem.js → "gn-footer-item"
						const pathWithinComponents = fileName
							.replace(/^components\//, '')
							.replace(/\\/g, '/');
						const dirs = pathWithinComponents.split('/');
						// Drop the last element (filename)
						dirs.pop();
						const camelToKebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
						const localBlock = 'gn-' + (dirs.length ? dirs.map(camelToKebab).join('-') : camelToKebab(componentName));

						const keyed = `${componentName}::${localBlock}`;
						const componentCSSContent =
							componentCSS.get(keyed) ||
							// fallback to single-bucket name if no disambiguated bucket exists
							componentCSS.get(componentName) ||
							// also attempt any bucket that starts with `${componentName}::`
							Array.from(componentCSS.keys())
								.filter((k) => k.startsWith(componentName + '::'))
								.map((k) => componentCSS.get(k))
								.join('\n');
						if (componentCSSContent) {
							// Add CSS import to the beginning of the component
							const cssImport = `import './${componentName}.css';\n`;
							chunk.code = cssImport + chunk.code;

							// Create individual CSS file
							this.emitFile({
								type: 'asset',
								fileName: cssFileName,
								source: componentCSSContent,
							});
						}
					}
				}
			});
		},
	};
};


