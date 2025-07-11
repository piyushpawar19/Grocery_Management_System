import { Component, EventEmitter, Output } from '@angular/core';
import { ProductSearchService, Product } from '../../services/product-search.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  @Output() searchResults = new EventEmitter<Product[]>();
  @Output() searchError = new EventEmitter<string>();
  @Output() searchLoading = new EventEmitter<boolean>();
  @Output() clearSearch = new EventEmitter<void>();

  searchQuery = '';

  constructor(private productSearchService: ProductSearchService) {}

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.searchResults.emit([]);
      return;
    }

    this.searchLoading.emit(true);
    
    this.productSearchService.searchProducts(this.searchQuery.trim()).subscribe({
      next: (results) => {
        this.searchResults.emit(results);
        this.searchLoading.emit(false);
      },
      error: (error) => {
        console.error('Search error:', error);
        this.searchError.emit('Failed to search products. Please try again.');
        this.searchLoading.emit(false);
      }
    });
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  onClearSearch() {
    console.log('Clear search button clicked');
    this.searchQuery = '';
    this.clearSearch.emit(); // Emit clear event to parent
  }
} 