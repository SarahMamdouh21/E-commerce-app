import { Component, OnInit, inject } from '@angular/core';
import { CategoryService } from '../../core/service/category.service';
import { Icategory } from '../../core/interface/icategory';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit{
  private readonly __CategoryService = inject(CategoryService);
  categorylist: Icategory[] = [];
  subcategory!:Icategory[];
  getallcategories!: Subscription;
  ngOnInit(): void {
    // Assign the subscription to getallproducts
    
    this.getallcategories = this.__CategoryService.getallcategories().subscribe({
      next: (res) => {
        console.log(res.data);
        this.categorylist = res.data;  
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.getallcategories = this.__CategoryService.getallcategories().subscribe({
      next: (res) => {
        console.log(res.data);
        this.categorylist = res.data;  
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  getAllSubCategories(catgeoryId:string) {
    this.__CategoryService.getaonecategory(catgeoryId).subscribe({
      next: (res) => {
        this.subcategory = res.data;
        // console.log(this.categoryList);
      },
      error: (err) => {
        console.log(err);      },
    });
  }
  ngOnDestroy(): void {
    
    this.getallcategories?.unsubscribe();
    
  }
}
