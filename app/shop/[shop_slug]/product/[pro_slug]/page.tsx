import { getProductByShop } from "@/lib/data";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./ProductDetailClient";

export default async function ShopProductDetailPage({
  params,
}: {
  params: Promise<{ shop_slug: string; pro_slug: string }>;
}) {
  const { shop_slug, pro_slug } = await params;
  const product = getProductByShop(shop_slug, pro_slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} shop_slug={shop_slug} />;
}
