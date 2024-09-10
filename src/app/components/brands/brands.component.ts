import { Component } from '@angular/core';
import { IBrands,Brands } from '../../core/interface/ibrands';
import { BrandsService } from '../../core/service/brands.service';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent {
  brandsList:Brands[] = [];
  

  constructor(private _BrandsService: BrandsService) {}

  ngOnInit(): void {
    if (typeof localStorage != 'undefined') {
      localStorage.setItem('currentPage', '/brands');
    }

    this.getAllBrands();
  }

  getAllBrands() {
   
    this._BrandsService.getAllBrands().subscribe({
      next: (res) => {
        this.brandsList = res.data;
        console.log(this.brandsList);
       
      },
      error: (err) => {
        
        console.log(err);
      },
    });
  }
}
