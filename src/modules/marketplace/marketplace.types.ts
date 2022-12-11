export interface MarketPlaceDto {
  title?: string;
  link: string;
  price: string;
  image_link: string;
  status: string;
  userId: number;
}

export interface CreateProductDto {
  title?: string;
  link?: string;
  price?: string;
}
