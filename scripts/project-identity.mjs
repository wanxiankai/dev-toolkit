import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const [command = "show", ...rest] = argv;
  const args = {};

  for (let i = 0; i < rest.length; i += 1) {
    const current = rest[i];
    if (!current.startsWith("--")) continue;

    const key = current.slice(2);
    const value = rest[i + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }
    args[key] = value;
    i += 1;
  }

  return {
    command,
    updates: {
      productName: args["product-name"],
      packageName: args["package-name"],
      siteUrl: args["site-url"],
      creator: args["creator"],
      authorName: args["author-name"],
    },
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function readSiteConfig(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function writeSiteConfig(filePath, content) {
  fs.writeFileSync(filePath, content);
}

function getCurrentIdentity(rootDir) {
  const packageJsonPath = path.join(rootDir, "package.json");
  const siteConfigPath = path.join(rootDir, "config", "site.ts");
  const packageJson = readJson(packageJsonPath);
  const siteConfig = readSiteConfig(siteConfigPath);

  const baseUrlMatch = siteConfig.match(
    /export const BASE_URL = process\.env\.NEXT_PUBLIC_SITE_URL \|\| "([^"]+)";/
  );
  const productNameMatch = siteConfig.match(/name: "([^"]+)",/);
  const authorNameMatch = siteConfig.match(/authors:\s*\[\s*\{\s*name: "([^"]+)",\s*url: BASE_URL,/s);
  const creatorMatch = siteConfig.match(/creator: '([^']+)',/);

  return {
    packageName: packageJson.name,
    productName: productNameMatch?.[1] ?? "",
    siteUrl: baseUrlMatch?.[1] ?? "",
    authorName: authorNameMatch?.[1] ?? "",
    creator: creatorMatch?.[1] ?? "",
  };
}

function requireAtLeastOneUpdate(updates) {
  if (Object.values(updates).every((value) => !value)) {
    throw new Error(
      [
        "No updates provided.",
        "Usage:",
        '  pnpm template:init --product-name "My Product" --package-name my-product --site-url https://example.com',
        '  pnpm template:update --product-name "New Name"',
        '  pnpm template:update --site-url https://new-domain.com',
        '  pnpm template:update --creator @handle --author-name "Your Name"',
        "  pnpm template:show",
      ].join("\n")
    );
  }
}

function applyPackageJsonUpdates(rootDir, updates) {
  if (!updates.packageName) return;

  const packageJsonPath = path.join(rootDir, "package.json");
  const packageJson = readJson(packageJsonPath);
  packageJson.name = updates.packageName;
  writeJson(packageJsonPath, packageJson);
}

function replaceWithRegexOrThrow(content, regex, replaceFn, label) {
  if (!regex.test(content)) {
    throw new Error(`Expected to find ${label} in config/site.ts`);
  }

  return content.replace(regex, replaceFn);
}

function applySiteConfigUpdates(rootDir, updates) {
  const siteConfigPath = path.join(rootDir, "config", "site.ts");
  let content = readSiteConfig(siteConfigPath);

  if (updates.siteUrl) {
    content = replaceWithRegexOrThrow(
      content,
      /export const BASE_URL = process\.env\.NEXT_PUBLIC_SITE_URL \|\| "[^"]+";/,
      `export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "${updates.siteUrl}";`,
      "BASE_URL"
    );
  }

  if (updates.productName) {
    content = replaceWithRegexOrThrow(
      content,
      /  name: "[^"]+",/,
      `  name: "${updates.productName}",`,
      "siteConfig.name"
    );
  }

  if (updates.authorName) {
    content = replaceWithRegexOrThrow(
      content,
      /      name: "[^"]+",\n\s+url: BASE_URL,/,
      `      name: "${updates.authorName}",\n      url: BASE_URL,`,
      "siteConfig.authors[0].name"
    );
  }

  if (updates.creator) {
    content = replaceWithRegexOrThrow(
      content,
      /  creator: '[^']+',/,
      `  creator: '${updates.creator}',`,
      "siteConfig.creator"
    );
  }

  writeSiteConfig(siteConfigPath, content);
}

function printIdentity(identity) {
  console.log("\nCurrent project identity:\n");
  console.log(`- productName: ${identity.productName}`);
  console.log(`- packageName: ${identity.packageName}`);
  console.log(`- siteUrl: ${identity.siteUrl}`);
  console.log(`- authorName: ${identity.authorName}`);
  console.log(`- creator: ${identity.creator}`);
}

function printApplySummary(updates) {
  console.log("\nProject identity updated.\n");
  console.log("Applied fields:");

  for (const [key, value] of Object.entries(updates)) {
    if (value) {
      console.log(`- ${key}: ${value}`);
    }
  }

  console.log("\nRecommended next steps:");
  console.log("- Review config/site.ts");
  console.log("- Update .env.local or deployment env vars if the domain changed");
  console.log("- Replace logos and Open Graph images in public/ if branding changed");
  console.log("- Review i18n copy, legal pages, and metadata if the product name changed");
}

function main() {
  const rootDir = process.cwd();
  const { command, updates } = parseArgs(process.argv.slice(2));

  if (command === "show") {
    printIdentity(getCurrentIdentity(rootDir));
    return;
  }

  if (command !== "apply") {
    throw new Error(`Unsupported command: ${command}`);
  }

  requireAtLeastOneUpdate(updates);
  applyPackageJsonUpdates(rootDir, updates);
  applySiteConfigUpdates(rootDir, updates);
  printApplySummary(updates);
  printIdentity(getCurrentIdentity(rootDir));
}

main();
