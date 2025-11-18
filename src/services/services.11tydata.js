module.exports = {
  layout: "service-layout.njk",
  tags: ["services"],
  permalink: "services/{{ page.fileSlug }}/",
  eleventyComputed: {
    button_link: (data) => data.button_link || "/contact/",
    button_title: (data) => data.button_title || "Contact Us",
    image_url: (data) =>
      data.image_url && data.image_url.trim() !== ""
        ? data.image_url
        : "/assets/images/logo.png",
    icon_url: (data) =>
      data.icon_url && data.icon_url.trim() !== "" ? data.icon_url : null,
  },
};

