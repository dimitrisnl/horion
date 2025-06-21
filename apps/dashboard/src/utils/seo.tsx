export const seo = ({
  title,
  description,
  keywords,
  image,
}: {
  title: string;
  description?: string;
  image?: string;
  keywords?: string;
}) => {
  const tags = [
    {title},
    {name: "description", content: description},
    {name: "keywords", content: keywords},
    {name: "twitter:title", content: title},
    {name: "twitter:description", content: description},
    {name: "twitter:creator", content: "@handle"},
    {name: "twitter:site", content: "@handle"},
    {name: "og:type", content: "website"},
    {name: "og:title", content: title},
    {name: "og:description", content: description},
    ...(image
      ? [
          {name: "twitter:image", content: image},
          {name: "twitter:card", content: "summary_large_image"},
          {name: "og:image", content: image},
        ]
      : []),
  ];

  return tags;
};

export const favicons = [
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/apple-touch-icon.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/favicon-16x16.png",
  },
  {rel: "manifest", href: "/site.webmanifest", color: "#fffff"},
  {rel: "icon", href: "/favicon.ico"},
];

export const basicMeta = [
  {
    charSet: "utf-8",
  },
  {
    name: "viewport",
    content: "width=device-width, initial-scale=1",
  },
];
