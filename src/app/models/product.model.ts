export interface Product {
    discountedPrice?: any;
    originalPrice?: any;
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    quantity?:number
  }