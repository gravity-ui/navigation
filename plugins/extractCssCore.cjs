const postcssLib = require('postcss');

const parseComponentCSS = (cssContent) => {
	const root = postcssLib.parse(String(cssContent));
	const componentToRoot = new Map();
	const ensureRoot = (key) => {
		if (!componentToRoot.has(key)) {
			componentToRoot.set(key, postcssLib.root());
		}
		return componentToRoot.get(key);
	};
	const getComponentKeyFromSelector = (selector) => {
		if (!selector) return null;
		const m = selector.match(/\.([A-Z][a-zA-Z0-9]*)-module__([a-zA-Z0-9-]+)/);
		if (!m) return null;
		const [, name, local] = m;
		return {name, local};
	};
	const bucketize = (node) => {
		const buckets = new Map();
		if (node.type === 'rule') {
			const rawSelectors = String(node.selector || '').split(',');
			// Build a map: componentKey -> selectors belonging to that component only
			const selectorsByKey = new Map();
			for (const raw of rawSelectors) {
				const sel = raw.trim();
				const info = getComponentKeyFromSelector(sel);
				if (!info) continue;
				const key = `${info.name}::${info.local}`;
				if (!selectorsByKey.has(key)) selectorsByKey.set(key, []);
				selectorsByKey.get(key).push(sel);
			}
			// For each component key create a cloned rule that contains ONLY its selectors
			for (const [key, sels] of selectorsByKey) {
				if (!sels.length) continue; // nothing to emit for this key
				const cloned = node.clone();
				cloned.selector = sels.join(', ');
				if (!buckets.has(key)) buckets.set(key, []);
				buckets.get(key).push(cloned);
			}
		} else if (node.type === 'atrule') {
			for (const child of node.nodes || []) {
				const childBuckets = bucketize(child);
				for (const [key, nodes] of childBuckets) {
					const atClone = postcssLib.atRule({name: node.name, params: node.params});
					nodes.forEach((n) => atClone.append(n));
					if (!buckets.has(key)) buckets.set(key, []);
					buckets.get(key).push(atClone);
				}
			}
		}
		return buckets;
	};
	for (const n of root.nodes || []) {
		const buckets = bucketize(n);
		for (const [key, nodes] of buckets) {
			const r = ensureRoot(key);
			nodes.forEach((cn) => r.append(cn));
		}
	}
	const result = new Map();
	for (const [key, compRoot] of componentToRoot) {
		result.set(key, compRoot.toString());
	}
	return result;
};

module.exports = {parseComponentCSS};


