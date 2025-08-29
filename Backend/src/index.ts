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
async function fetchAmazon(query: string): Promise<Product[]> {
  try {
    const res = await axios.post(
      OXYLABS_URL,
      {
        source: "amazon_search",
        query,
        geo_location: "90210",
        parse: true,
      },
      { auth: AUTH, headers: { "Content-Type": "application/json" } }
    );

    const items = res.data.results[0]?.content?.results?.paid || [];
    return items.map((p: any) => ({
      title: p.title,
      price: p.price,
      currency: p.currency || "USD",
      image: p.url_image,
      url: p.url,
      source: "Amazon" as const,
    }));
  } catch (err) {
    console.error("Amazon fetch error:", err);
    return [];
  }
}

// 🔹 Flipkart API
async function fetchFlipkart(query: string): Promise<Product[]> {
  try {
    const res = await axios.post(
      OXYLABS_URL,
      { source: "flipkart_search", query },
      { auth: AUTH, headers: { "Content-Type": "application/json" } }
    );

    const html = res.data.results[0]?.content?.content || "";
    const $ = cheerio.load(html);
    const products: Product[] = [];

    $("a").each((_, el) => {
      const title =
        $(el).find("div._4rR01T").text() ||
        $(el).find("a.s1Q9rs").attr("title");
      const priceText = $(el).find("div._30jeq3").text().replace(/[₹,]/g, "");
      const price = parseFloat(priceText) || 0;
      const image = $(el).find("img").attr("src") || "";
      const url =
        "https://www.flipkart.com" + ($(el).attr("href") || "");

      if (title && price > 0) {
        products.push({
          title,
          price,
          currency: "INR",
          image,
          url,
          source: "Flipkart",
        });
      }
    });

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
