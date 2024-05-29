import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() totalItems!: number;
  @Input() itemsPerPage!: number;
  @Input() currentPage: number = 1;
  @Output() pageChanged: EventEmitter<number> = new EventEmitter<number>();

  totalPages!: number;
  pageNumbers: number[] = [];

  ngOnInit(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.setPageNumbers();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['totalItems'] && changes['itemsPerPage'] && changes['currentPage']) {
      this.totalItems = changes['totalItems'].currentValue
      this.itemsPerPage = changes['itemsPerPage'].currentValue
      this.currentPage = changes['currentPage'].currentValue
    }
  }

  setPageNumbers(): void {
    const totalPagesToShow = 2;
    const halfRange = Math.floor(totalPagesToShow / 2);
    
    let startPage = Math.max(1, this.currentPage - halfRange);
    let endPage = Math.min(this.totalPages, this.currentPage + halfRange);

    if (startPage === 1) {
      endPage = Math.min(this.totalPages, totalPagesToShow);
    } else if (endPage === this.totalPages) {
      startPage = Math.max(1, this.totalPages - totalPagesToShow + 1);
    }

    this.pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      this.pageNumbers.push(i);
    }

    if (startPage > 1) {
      this.pageNumbers.unshift(1, -1); // -1 será usado para representar "..."
    }
    if (endPage < this.totalPages) {
      this.pageNumbers.push(-1, this.totalPages); // -1 será usado para representar "..."
    }
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    this.currentPage = page;
    this.pageChanged.emit(this.currentPage);
    this.setPageNumbers();
  }
}
