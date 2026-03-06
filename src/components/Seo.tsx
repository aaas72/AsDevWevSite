import { useEffect } from "react";

interface SeoProps {
  title: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: string; // website, article
  canonicalPath?: string; // e.g. "/about"
  noindex?: boolean;
}

function upsertMetaByName(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertMetaByProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

export default function Seo({
  title,
  description,
  keywords,
  image,
  type = "website",
  canonicalPath,
  noindex,
}: SeoProps) {
  useEffect(() => {
    document.title = title;

    if (description) upsertMetaByName("description", description);
    if (keywords?.length) upsertMetaByName("keywords", keywords.join(", "));
    upsertMetaByName("robots", noindex ? "noindex, nofollow" : "index, follow");

    const origin = window.location.origin;
    const canonical = canonicalPath ? `${origin}${canonicalPath}` : origin;
    upsertCanonical(canonical);

    upsertMetaByProperty("og:title", title);
    if (description) upsertMetaByProperty("og:description", description);
    upsertMetaByProperty("og:type", type);
    upsertMetaByProperty("og:url", canonical);
    if (image) upsertMetaByProperty("og:image", image);
    upsertMetaByProperty("og:site_name", "AS.DEV");

    upsertMetaByName("twitter:card", image ? "summary_large_image" : "summary");
    upsertMetaByName("twitter:title", title);
    if (description) upsertMetaByName("twitter:description", description);
    if (image) upsertMetaByName("twitter:image", image);
  }, [title, description, keywords, image, type, canonicalPath, noindex]);

  return null;
}