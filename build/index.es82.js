import { __exports as classname_development } from './index.es101.js';

var hasRequiredClassname_development;

function requireClassname_development () {
	if (hasRequiredClassname_development) return classname_development;
	hasRequiredClassname_development = 1;

	Object.defineProperty(classname_development, '__esModule', { value: true });

	/**
	 * BEM className configure function.
	 *
	 * @example
	 * ``` ts
	 *
	 * import { withNaming } from '@bem-react/classname';
	 *
	 * const cn = withNaming({ n: 'ns-', e: '__', m: '_' });
	 *
	 * cn('block', 'elem'); // 'ns-block__elem'
	 * ```
	 *
	 * @param preset settings for the naming convention
	 */
	function withNaming(preset) {
	    var nameSpace = preset.n || '';
	    var modValueDelimiter = preset.v || preset.m;
	    function stringify(b, e, m, mix) {
	        var entityName = e ? nameSpace + b + preset.e + e : nameSpace + b;
	        var className = entityName;
	        if (m) {
	            var modPrefix = ' ' + className + preset.m;
	            for (var k in m) {
	                if (m.hasOwnProperty(k)) {
	                    var modVal = m[k];
	                    if (modVal === true) {
	                        className += modPrefix + k;
	                    }
	                    else if (modVal) {
	                        className += modPrefix + k + modValueDelimiter + modVal;
	                    }
	                }
	            }
	        }
	        if (mix !== undefined) {
	            mix = Array.isArray(mix) ? mix : [mix];
	            for (var i = 0, len = mix.length; i < len; i++) {
	                var value = mix[i];
	                // Skipping non-string values and empty strings
	                if (!value || typeof value.valueOf() !== 'string')
	                    continue;
	                var mixes = value.valueOf().split(' ');
	                for (var j = 0; j < mixes.length; j++) {
	                    var val = mixes[j];
	                    if (val !== entityName) {
	                        className += ' ' + val;
	                    }
	                }
	            }
	        }
	        return className;
	    }
	    return function cnGenerator(b, e) {
	        return function (elemOrMods, elemModsOrBlockMix, elemMix) {
	            if (typeof elemOrMods === 'string') {
	                if (typeof elemModsOrBlockMix === 'string' || Array.isArray(elemModsOrBlockMix)) {
	                    return stringify(b, elemOrMods, undefined, elemModsOrBlockMix);
	                }
	                return stringify(b, elemOrMods, elemModsOrBlockMix, elemMix);
	            }
	            return stringify(b, e, elemOrMods, elemModsOrBlockMix);
	        };
	    };
	}
	/**
	 * BEM Entity className initializer with React naming preset.
	 *
	 * @example
	 * ``` ts
	 *
	 * import { cn } from '@bem-react/classname';
	 *
	 * const cat = cn('Cat');
	 *
	 * cat(); // Cat
	 * cat({ size: 'm' }); // Cat_size_m
	 * cat('Tail'); // Cat-Tail
	 * cat('Tail', { length: 'small' }); // Cat-Tail_length_small
	 *
	 * const dogPaw = cn('Dog', 'Paw');
	 *
	 * dogPaw(); // Dog-Paw
	 * dogPaw({ color: 'black', exists: true }); // Dog-Paw_color_black Dog-Paw_exists
	 * ```
	 *
	 * @see https://en.bem.info/methodology/naming-convention/#react-style
	 */
	var cn = withNaming({
	    e: '-',
	    m: '_',
	});

	classname_development.cn = cn;
	classname_development.withNaming = withNaming;
	return classname_development;
}

export { requireClassname_development as __require };
//# sourceMappingURL=index.es82.js.map
