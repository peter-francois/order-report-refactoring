import { ProductCategoryEnum } from "./enum/product.enum";

export interface ProductInterface {
  id: string;
  name: string;
  category: ProductCategoryEnum;
  price: number;
  weight: number;
  taxable: boolean;
}
