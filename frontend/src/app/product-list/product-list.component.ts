import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CartService } from '../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  marketCategories: string[] = [
    'Breads',
    'Cold-Drinks',
    'Fruit',
    'Juices',
    'Meats',
    'Vegetables'
  ];
  drinkjuices:Product[]=[
    {
      id: 1,
      name: 'Fresh Red Tomatoes',
      description: 'Fresh Red Tomatoes',
      price: 6.99,
      imageUrl: 'assets/fresh-red-tomatos.png',
      originalPrice: 12.99,
      discountedPrice: 6.99
    },
    {
      id: 2,
      name: 'Chicken Eggs',
      description: 'Chicken Eggs',
      price: 6.99,
      imageUrl: 'assets/chicken-eggs.png',
      originalPrice: 12.99,
      discountedPrice: 6.99
    },
    {
      id: 3,
      name: 'Fresh Watermelon',
      description: 'Fresh Watermelon',
      price: 6.99,
      imageUrl: 'assets/fresh-watermelon.png',
      originalPrice: 12.99,
      discountedPrice: 6.99
    },
    {
      id: 4,
      name: 'Beef Steak',
      description: 'Beef Steak',
      price: 6.99,
      imageUrl: 'assets/Beef-steak.png',
      originalPrice: 12.99,
      discountedPrice: 6.99
    }
    
  ];
  topSellingProducts: Product[] = [
    {
      id: 1,
      name: 'White Eggplant',
      description: 'Fresh white eggplant',
      price: 6.99,
      imageUrl: 'assets/TopSellingProducts/White Eggplant.jpg',
      originalPrice: 12.99,
      discountedPrice: 6.99
    },
    {
      id: 2,
      name: 'Fresh Mashroom',
      description: 'Fresh mushrooms',
      price: 5.99,
      imageUrl: 'assets/TopSellingProducts/Fresh Mushroom.jpg',
      originalPrice: 10.99,
      discountedPrice: 5.99
    },
    {
      id: 3,
      name: 'Hot Patties',
      description: 'Delicious hot patties',
      price: 3.99,
      imageUrl: 'assets/TopSellingProducts/Hot Patties.jpg',
      originalPrice: 5.99,
      discountedPrice: 3.99
    },
    {
      id: 4,
      name: 'Fresh Bananas',
      description: 'Ripe fresh bananas',
      price: 4.99,
      imageUrl: 'assets/TopSellingProducts/Fresh Bananas.jpg',
      originalPrice: 8.99,
      discountedPrice: 4.99
    },
    {
      id: 5,
      name: 'Terraorganics',
      description: 'Organic oranges',
      price: 6.99,
      imageUrl: 'assets/TopSellingProducts/Terraorganics.jpg',
      originalPrice: 12.99,
      discountedPrice: 6.99
    },
    {
      id: 6,
      name: 'Orange Fruit',
      description: 'Fresh oranges',
      price: 8.99,
      imageUrl: 'assets/TopSellingProducts/Orange Fruit.jpg',
      originalPrice: 15.99,
      discountedPrice: 8.99
    }
  ];
  new_arrivals = [
    { name: "Chicken Eggs", original_price: 12.99, sale_price: 6.99, image: "assets/chicken-eggs.png" },
    { name: "Fresh Red Tomatos", original_price: 12.99, sale_price: 6.99, image: "assets/fresh-red-tomatos.png" },
    { name: "Fresh Oranges", original_price: 12.99, sale_price: 6.99, image: "assets/TopSellingProducts/Orange Fruit.jpg" },
    { name: "Fresh Mushroom", original_price: 12.99, sale_price: 6.99, image: "assets/TopSellingProducts/Fresh Mushroom.jpg" },
    { name: "Terraorganics", original_price: 12.99, sale_price: 6.99, image: "assets/TopSellingProducts/Terraorganics.jpg" },
    { name: "Cold Drinks", original_price: 12.99, sale_price: 6.99, image: "assets/icons/cold-drinks.png" }
  ];
  featuredProducts: Product[] = [];
  days: number = 157;
  hours: number = 23;
  minutes: number = 13;
  seconds: number = 49;
  private timer: any;

  page: number = 1;
  limit: number = 10;
  isLoading: boolean = false;

  constructor(
    private productService: ProductService,
    private cartService:CartService,
    private snackBar:MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadFeaturedProducts();
    this.startTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  loadProducts(): void {
    if (this.isLoading) return;
    this.isLoading = true;
    this.productService.getProducts(this.page, this.limit).subscribe(
      (data: Product[]) => {
        this.products = this.products.concat(data);
        this.page++;
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching products:', error);
        this.isLoading = false;
      }
    );
  }

  loadFeaturedProducts(): void {
    this.productService.getProducts(1, 4).subscribe(
      (data: Product[]) => {
        this.featuredProducts = data;
      },
      error => {
        console.error('Error fetching featured products:', error);
      }
    );
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  updateTimer() {
    this.seconds--;
    if (this.seconds < 0) {
      this.seconds = 59;
      this.minutes--;
      if (this.minutes < 0) {
        this.minutes = 59;
        this.hours--;
        if (this.hours < 0) {
          this.hours = 23;
          this.days--;
          if (this.days < 0) {
            this.stopTimer();
          }
        }
      }
    }
  }

  onScroll(): void {
    this.loadProducts();
  }

  shopNow(): void {
    console.log('Shop Now clicked');
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.showNotification();
    console.log('Add to cart clicked for product:', product);
  
  }
  showNotification(){
    this.snackBar.open('Successfully Added To Cart ', 'Close', {
      duration: 3000,  // Duration in milliseconds
    });
  }
  
}