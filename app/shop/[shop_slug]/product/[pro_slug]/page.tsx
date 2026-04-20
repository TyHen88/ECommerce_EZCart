import { productService } from "@/service/product.service";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./ProductDetailClient";
import { ProductResponseDto } from "@/lib/types";

interface CatalogProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image_url: { url: string; alt: string }[];
  stock: number;
  category: string;
  created_at: string;
}

export default async function ShopProductDetailPage({
  params,
}: {
  params: Promise<{ shop_slug: string; pro_slug: string }>;
}) {
  const { shop_slug, pro_slug } = await params;

  try {
    // Fetch product by slug
    const response = await productService.getProductBySlug(pro_slug);
    const apiProduct = response.data;

    // Transform to expected format
    const product: CatalogProduct = {
      id: apiProduct.id.toString(),
      slug: apiProduct.slug,
      name: apiProduct.title,
      description: apiProduct.description || "",
      price: apiProduct.price,
      image_url: apiProduct.images.map((img: { imageUrl: string; altText?: string }) => ({
        url: img.imageUrl,
        alt: img.altText || apiProduct.title
      })),
      stock: apiProduct.variations.reduce((sum: number, v: { stockQuantity: number }) => sum + v.stockQuantity, 0),
      category: apiProduct.categories.map((c: { name: string }) => c.name).join(", ") || "Uncategorized",
      created_at: apiProduct.createdAt
    };

    return <ProductDetailClient product={product} shop_slug={shop_slug} />;
  } catch (error) {
    notFound();
  }
}
