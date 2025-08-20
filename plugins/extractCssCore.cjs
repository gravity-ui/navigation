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
			const selectors = String(node.selector || '').split(',');
			let key = null;
			for (const s of selectors) {
				const info = getComponentKeyFromSelector(s.trim());
				if (info) { key = `${info.name}::${info.local}`; break; }
			}
			if (key) {
				buckets.set(key, [node.clone()]);
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


