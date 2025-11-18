// const pluginSitemap = require("@quasibit/eleventy-plugin-sitemap");
const fs = require("fs");
const markdownIt = require("markdown-it");
const markdownItTable = require("markdown-it-multimd-table");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/scripts": "scripts" });
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("dist");
  eleventyConfig.addFilter("split", function (str, delimiter) {
    return str.split(delimiter);
  });
  eleventyConfig.addFilter("readableDate", (dateObj, format = "MMMM d, yyyy") => {
    const date = new Date(dateObj);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  eleventyConfig.addFilter("formatPhone", (value) => {
    if (!value) return value;
    const digits = String(value).replace(/\D/g, "");
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return value;
  });

  const serviceOrder = [
    "Residential Standard and Standing Seam Metal Roof Replacements",
    "Residential Leak Repairs and Maintenance",
    "Flat Roofing Commercial and Residential Replacements",
    "Flat Roofing Leak Repairs and Maintenance",
    "Insulation Top Ups",
    "Special Projects",
  ];
  const serviceOrderMap = serviceOrder.reduce((map, title, index) => {
    map[title] = index;
    return map;
  }, {});

  eleventyConfig.addCollection("servicesOrdered", (collectionApi) => {
    return collectionApi
      .getFilteredByTag("posts")
      .sort((a, b) => {
        const aIndex =
          serviceOrderMap.hasOwnProperty(a.data.title)
            ? serviceOrderMap[a.data.title]
            : serviceOrder.length;
        const bIndex =
          serviceOrderMap.hasOwnProperty(b.data.title)
            ? serviceOrderMap[b.data.title]
            : serviceOrder.length;
        if (aIndex === bIndex) {
          return (a.data.title || "").localeCompare(b.data.title || "");
        }
        return aIndex - bIndex;
      });
  });

  eleventyConfig.addCollection("blog", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/blog/**/*.md")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("services", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/services/**/*.md")
      .sort((a, b) => {
        const aOrder = a.data.order ?? Number.MAX_SAFE_INTEGER;
        const bOrder = b.data.order ?? Number.MAX_SAFE_INTEGER;

        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }

        return (a.data.title || "").localeCompare(b.data.title || "");
      });
  });
  
  const markdownLibrary = markdownIt({
    html: true,
    linkify: true,
  }).use(markdownItTable, {
    enableMultilineRows: true,
    enableRowspan: true,
    enableColspan: true,
  });

  const headingOpen =
    markdownLibrary.renderer.rules.heading_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  const paragraphOpen =
    markdownLibrary.renderer.rules.paragraph_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };
  const tableOpen =
    markdownLibrary.renderer.rules.table_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };
  const theadOpen =
    markdownLibrary.renderer.rules.thead_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };
  const tbodyOpen =
    markdownLibrary.renderer.rules.tbody_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };
  const trOpen =
    markdownLibrary.renderer.rules.tr_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };
  const thOpen =
    markdownLibrary.renderer.rules.th_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };
  const tdOpen =
    markdownLibrary.renderer.rules.td_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  const headingClassMap = {
    h1: "govuk-heading-xl",
    h2: "govuk-heading-l",
    h3: "govuk-heading-m",
    h4: "govuk-heading-s",
    h5: "govuk-heading-s",
    h6: "govuk-heading-s",
  };

  markdownLibrary.renderer.rules.heading_open = function (
    tokens,
    idx,
    options,
    env,
    self
  ) {
    const token = tokens[idx];
    const headingClass = headingClassMap[token.tag];

    if (headingClass) {
      token.attrJoin("class", headingClass);
    }

    return headingOpen(tokens, idx, options, env, self);
  };

  markdownLibrary.renderer.rules.paragraph_open = function (
    tokens,
    idx,
    options,
    env,
    self
  ) {
    const token = tokens[idx];
    token.attrJoin("class", "govuk-body");

    return paragraphOpen(tokens, idx, options, env, self);
  };

  markdownLibrary.renderer.rules.table_open = function (
    tokens,
    idx,
    options,
    env,
    self
  ) {
    const token = tokens[idx];
    token.attrJoin("class", "govuk-table");
    return tableOpen(tokens, idx, options, env, self);
  };

  markdownLibrary.renderer.rules.thead_open = function (
    tokens,
    idx,
    options,
    env,
    self
  ) {
    const token = tokens[idx];
    token.attrJoin("class", "govuk-table__head");
    return theadOpen(tokens, idx, options, env, self);
  };

  markdownLibrary.renderer.rules.tbody_open = function (
    tokens,
    idx,
    options,
    env,
    self
  ) {
    const token = tokens[idx];
    token.attrJoin("class", "govuk-table__body");
    return tbodyOpen(tokens, idx, options, env, self);
  };

  markdownLibrary.renderer.rules.tr_open = function (
    tokens,
    idx,
    options,
    env,
    self
  ) {
    const token = tokens[idx];
    token.attrJoin("class", "govuk-table__row");
    return trOpen(tokens, idx, options, env, self);
  };

  markdownLibrary.renderer.rules.th_open = function (
    tokens,
    idx,
    options,
    env,
    self
  ) {
    const token = tokens[idx];
    token.attrJoin("class", "govuk-table__header");
    if (!token.attrGet("scope")) {
      token.attrSet("scope", "col");
    }
    return thOpen(tokens, idx, options, env, self);
  };

  markdownLibrary.renderer.rules.td_open = function (
    tokens,
    idx,
    options,
    env,
    self
  ) {
    const token = tokens[idx];
    token.attrJoin("class", "govuk-table__cell");
    return tdOpen(tokens, idx, options, env, self);
  };

  eleventyConfig.setLibrary("md", markdownLibrary);

  // Ensure directories exist before writing for permalink-based routes
  eleventyConfig.on("beforeBuild", () => {
    const dirs = ["_site/roof-installation", "_site/roof-repair"];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  });
  
  return {
    dir: {
      input: "src", // or your input dir
      output: "_site",
      includes: "_includes",
    },
  };
};
