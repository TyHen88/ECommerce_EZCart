import { ProductResponseDto } from "@/lib/types";

export type ProductGridItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock: number;
  category: string | null;
  categorySlug: string | null;
};

export type ProductDetailViewModel = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: {
    url: string;
    alt: string;
  }[];
  stock: number;
  category: string | null;
  categorySlug: string | null;
  sku: string | null;
  isFeatured: boolean;
  isNew: boolean;
};

export type ProductAdminItem = ProductGridItem & {
  isActive: boolean;
  sku: string | null;
};

export type ProductFormInitialData = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  sku: string;
  currency: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  taxRate: string;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  categoryIds: number[];
  primaryImageUrl: string;
  primaryImageAltText: string;
  stock: string;
};

function getPrimaryImage(product: ProductResponseDto) {
  return (
    product.images.find((image) => image.isPrimary) ??
    product.images[0] ??
    null
  );
}

function getPrimaryCategory(product: ProductResponseDto) {
  return product.categories[0] ?? null;
}

export function getProductStock(product: ProductResponseDto): number {
  return product.variations.reduce(
    (total, variation) => total + Math.max(variation.stockQuantity ?? 0, 0),
    0
  );
}

export function normalizeCategorySlug(value?: string | null): string | undefined {
  if (!value) return undefined;

  const normalized = value.trim().toLowerCase().replace(/\s+/g, "-");
  return normalized || undefined;
}

export function mapProductToGridItem(product: ProductResponseDto): ProductGridItem {
  const primaryImage = getPrimaryImage(product);
  const primaryCategory = getPrimaryCategory(product);

  return {
    id: String(product.id),
    name: product.title,
    description: product.description,
    price: product.price,
    image_url: primaryImage?.imageUrl || null,
    stock: getProductStock(product),
    category: primaryCategory?.name || null,
    categorySlug: primaryCategory?.slug || null,
  };
}

export function mapProductToDetailViewModel(
  product: ProductResponseDto
): ProductDetailViewModel {
  const primaryCategory = getPrimaryCategory(product);

  return {
    id: String(product.id),
    name: product.title,
    description: product.description,
    price: product.price,
    image_url: product.images.map((image) => ({
      url: image.imageUrl,
      alt: image.altText || product.title,
    })),
    stock: getProductStock(product),
    category: primaryCategory?.name || null,
    categorySlug: primaryCategory?.slug || null,
    sku: product.sku || null,
    isFeatured: product.isFeatured,
    isNew: product.isNew,
  };
}

export function mapProductToAdminItem(product: ProductResponseDto): ProductAdminItem {
  return {
    ...mapProductToGridItem(product),
    isActive: product.isActive,
    sku: product.sku || null,
  };
}

export function mapProductToFormInitialData(
  product: ProductResponseDto
): ProductFormInitialData {
  const primaryImage = getPrimaryImage(product);

  return {
    id: String(product.id),
    title: product.title,
    slug: product.slug,
    description: product.description || "",
    price: product.price,
    sku: product.sku || "",
    currency: product.currency,
    weight: product.weight?.toString() || "",
    length: product.length?.toString() || "",
    width: product.width?.toString() || "",
    height: product.height?.toString() || "",
    taxRate: product.taxRate?.toString() || "0",
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    isNew: product.isNew,
    categoryIds: product.categories.map((category) => category.id),
    primaryImageUrl: primaryImage?.imageUrl || "",
    primaryImageAltText: primaryImage?.altText || "",
    stock: getProductStock(product).toString(),
  };
}
