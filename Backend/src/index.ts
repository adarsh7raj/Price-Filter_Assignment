import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import * as cheerio from "cheerio";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const OXYLABS_URL = process.env.OXYLABS_URL || "";
const AUTH = {
  username: process.env.OXYLABS_USERNAME || "",
  password: process.env.OXYLABS_PASSWORD || "",
};

export interface Product {
  title: string;
  price: number;
  currency: string;
  image: string;
  url: string;
  source: "Amazon" | "Flipkart";
}

// 🔹 Amazon API
// 🔹 Amazon API
// 🔹 Amazon API
async function fetchAmazon(query: string): Promise<Product[]> {
  try {
    const res = await axios.post<any>(
      OXYLABS_URL,
      {
        source: "amazon_search",
        query,
        geo_location: "IN",   // ✅ Force India
        parse: true,
      },
      { auth: AUTH, headers: { "Content-Type": "application/json" } }
    );

    const results = res.data.results[0]?.content?.results || {};
    const items = [...(results.organic || []), ...(results.paid || [])];

    const USD_TO_INR = 83;

    return items
      .filter(
        (p: any) =>
          p.url_image &&
          !p.url_image.includes("aax-us-east-retail-direct")
      )
      .map((p: any) => {
        // ✅ Extract price
        let rawPrice: string = p.price_str || p.price_raw || p.price || "";
        let price = 0;

        if (typeof rawPrice === "number") {
          price = rawPrice;
        } else if (typeof rawPrice === "string") {
          price = parseInt(rawPrice.replace(/[^\d]/g, ""), 10) || 0;
        }

        let currency = p.currency || "INR";

        // ✅ Convert if Oxylabs gives USD
        if (currency === "USD" && price > 0) {
          price = Math.round(price * USD_TO_INR);
          currency = "INR";
        }

        // ✅ Clean Amazon URL (remove tracking params, keep only /dp/ASIN part)
    let url = p.url || "";
if (url && !url.startsWith("http")) {
  url = "https://www.amazon.in" + url;
}

// Try to extract ASIN and normalize
const asinMatch = url.match(/([A-Z0-9]{10})/);
if (asinMatch) {
  url = `https://www.amazon.in/dp/${asinMatch[1]}`;
} else {
  // fallback: keep original URL if no ASIN
  url = p.url || "";
}

        return {
          title: p.title,
          price,
          currency,
          image: p.url_image,
          url,
          source: "Amazon" as const,
        };
      })
      .filter((p) => p.price > 0 && p.url); // ✅ ensure only valid products
  } catch (err) {
    if (typeof err === "object" && err !== null && "response" in err && "message" in err) {
      const e = err as { response?: { data?: any }; message?: string };
      console.error("Amazon fetch error:", e.response?.data || e.message);
    } else {
      console.error("Amazon fetch error:", err);
    }
    return [];
  }
}

// 🔹 Flipkart API
// 🔹 Flipkart API (scraping HTML)
// 🔹 Flipkart API (robust extraction with 3 fallbacks)
async function fetchFlipkart(query: string): Promise<Product[]> {
  try {
    const res = await axios.post<any>(
      "https://realtime.oxylabs.io/v1/queries",
      {
        source: "universal", // universal works everywhere
        url: `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`,
        geo_location: "India",
        browser: "chrome",   // ask for JS-rendered content
        parse: false
      },
      {
        auth: AUTH,
        headers: { "Content-Type": "application/json" }
      }
    );

    const html: string = res.data?.results?.[0]?.content || "";
    if (!html) {
      console.error("Flipkart response empty");
      return [];
    }

    // parse with cheerio here (same DOM/JSON-LD/JSON logic I gave earlier)
    const $ = cheerio.load(html);
    const products: Product[] = [];

    $("div[data-id]").each((_, el) => {
      const title = $(el).find("a.s1Q9rs, .IRpwTa, .KzDlHZ, ._4rR01T,.s1Q9rs,.KzDlHZ").first().text().trim();
      const priceText = $(el).find("div._30jeq3, .Nx9bqj,.Nx9bqj").first().text();
      const price = parseInt(priceText.replace(/[^\d]/g, ""), 10) || 0;
      const img = $(el).find("img").first().attr("src") || "";
      let url = $(el).find("a").first().attr("href") || "";
      if (url && !url.startsWith("http")) url = "https://www.flipkart.com" + url;

      if (title && price && url) {
        products.push({
          title,
          price,
          currency: "INR",
          image: img.startsWith("//") ? "https:" + img : img,
          url,
          source: "Flipkart"
        });
      }
    });
console.log(`Flipkart: Found ${products.length} products for query "${query}"`);
    return products;
  } catch (err) {
    console.error("Flipkart fetch error:", err);
    return [];
  }
}



// 🔹 API Route
interface ProductsRequestQuery {
    q?: string;
}

interface ErrorResponse {
    error: string;
}

app.get(
    "/api/products",
    async (
        req: express.Request<unknown, unknown, unknown, ProductsRequestQuery>,
        res: express.Response<Product[] | ErrorResponse>
    ) => {
        const query = req.query.q as string;
        if (!query) {
            return res.status(400).json({ error: "Query is required" });
            console
        }

        const [amazon, flipkart] = await Promise.all([
            fetchAmazon(query),
            fetchFlipkart(query),
        ]);

        const combined = [...amazon, ...flipkart].sort((a, b) => a.price - b.price);
        res.json(combined);
    }
);

app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
