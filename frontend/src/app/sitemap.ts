import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const serverApi = process.env.NEXT_PUBLIC_SERVER_API;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const locales = ["id", "en"];

  const products: { _id: string }[] = [];

  let page = 1;
  let pageCount = 1;

  while (page <= pageCount) {
    const res = await fetch(`${serverApi}/products?page=${page}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Error fetching page ${page} from API`);
      break;
    }

    const json = await res.json();
    products.push(...json.data.products);
    pageCount = json.data.pagination.totalPages;
    page++;
  }

  const urls: MetadataRoute.Sitemap = [];

  // Tambah homepage per locale
  locales.forEach((locale) => {
    const staticUrl = [
      {
        url: `${baseUrl}/${locale}`,
        lastModified: new Date(),
        priority: 1,
      },
      {
        url: `${baseUrl}/${locale}/about`,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/${locale}/terms-condition`,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/${locale}/faq`,
        lastModified: new Date(),
      },
    ];
    urls.push(...staticUrl);
  });

  // Tambah URL products per locale
  products.forEach((product) => {
    locales.forEach((locale) => {
      urls.push({
        url: `${baseUrl}/${locale}/products/${product._id}`,
        lastModified: new Date(),
      });
    });
  });

  return urls;
}
