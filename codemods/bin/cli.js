#!/usr/bin/env node

const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const {program} = require('commander');

const PACKAGE_DIR = path.dirname(__dirname);
const TRANSFORMS_DIR = path.join(PACKAGE_DIR, 'transforms');

const AVAILABLE_TRANSFORMS = ['v4'];

// Get available transforms
const availableTransforms = fs
    .readdirSync(TRANSFORMS_DIR)
    .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))
    .map((file) => file.replace(/\.(ts|js)$/, ''))
    .filter((file) => AVAILABLE_TRANSFORMS.includes(file));

function getTransformPath(transformName) {
    if (!availableTransforms.includes(transformName)) {
        throw new Error(
            `Transform "${transformName}" not found. Available transforms: ${availableTransforms.join(', ')}`,
        );
    }

    // Try .ts first, fallback to .js for compatibility
    const tsPath = path.join(TRANSFORMS_DIR, `${transformName}.ts`);
    const jsPath = path.join(TRANSFORMS_DIR, `${transformName}.js`);

    if (fs.existsSync(tsPath)) {
        return tsPath;
    } else if (fs.existsSync(jsPath)) {
        return jsPath;
    } else {
        throw new Error(`Transform file not found: ${transformName}`);
    }
}

function runTransform(transformName, targetPath, options = {}) {
    try {
        const transformPath = getTransformPath(transformName);
        let jscodeshiftPath;

        try {
            // Try to use local jscodeshift first
            jscodeshiftPath = require.resolve('jscodeshift/bin/jscodeshift.js');
        } catch {
            // Fallback to global jscodeshift
            jscodeshiftPath = 'jscodeshift';
        }

        const args = ['--transform', transformPath, '--extensions=ts,tsx,js,jsx', '--parser=tsx'];

        if (options.dry) {
            args.push('--dry');
        }

        if (options.verbose) {
            args.push('--verbose=2');
        } else {
            args.push('--verbose=1');
        }

        if (options.ignorePattern) {
            args.push(`--ignore-pattern=${options.ignorePattern}`);
        }

        args.push(targetPath);

        const command = `"${jscodeshiftPath}" ${args.map((arg) => `"${arg}"`).join(' ')}`;

        console.log(`Running transform "${transformName}" on ${targetPath}`);
        if (options.verbose) {
            console.log(`Command: ${command}`);
        }

        execSync(command, {
            stdio: 'inherit',
            cwd: process.cwd(),
        });

        console.log(`✓ Transform "${transformName}" completed`);
    } catch (error) {
        console.error(`✗ Error running transform "${transformName}":`, error.message);
        process.exit(1);
    }
}

// Set up CLI
program
    .name('navigation-codemod')
    .description('Codemods for @gravity-ui/navigation')
    .version(require('../../package.json').version);

program
    .command('transform <transformName> <path>')
    .description('Run a specific transform on files or directories')
    .option('-d, --dry', 'Dry run (no changes will be made)')
    .option('-v, --verbose', 'Verbose output')
    .option('--ignore-pattern <pattern>', 'Ignore files matching this pattern')
    .action((transformName, targetPath, options) => {
        runTransform(transformName, targetPath, options);
    });

program
    .command('list')
    .description('List all available transforms')
    .action(() => {
        console.log('Available transforms:');
        availableTransforms.forEach((transform) => {
            console.log(`  - ${transform}`);
        });
    });

// Default command to run v4 transforms
program
    .command('v4 <path>')
    .description('Run all transforms in sequence')
    .option('-d, --dry', 'Dry run (no changes will be made)')
    .option('-v, --verbose', 'Verbose output')
    .option('--ignore-pattern <pattern>', 'Ignore files matching this pattern')
    .action((targetPath, options) => {
        console.log('Running all transforms in sequence...');
        runTransform('v4', targetPath, options);
    });

// Help command
program
    .command('help')
    .description('Show help information')
    .action(() => {
        program.help();
    });

// Examples
program.on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log('  $ navigation-codemod transform v4 ./src');
    console.log('  $ navigation-codemod transform v4 ./src --dry');
    console.log('  $ navigation-codemod list');
    console.log('');
    console.log('Available transforms:');
    availableTransforms.forEach((transform) => {
        console.log(`  - ${transform}`);
    });
});

program.parse();
