import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { TrendingComponent } from './trending/trending.component';
import { SearchService } from '../core/services/search.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {
  searchForm: UntypedFormGroup = new UntypedFormGroup({
    'query': new UntypedFormControl('', [])
  });
  defaultLang: any;

  get query() {
    return this.searchForm.get('query')!;
  }
   
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _search: SearchService
  ) { }

  ngOnInit(): void {

    if (this._route.firstChild) {
      this._route.firstChild.paramMap.subscribe(async params => {
        const query = params.get('query')! ? `${params.get('query')!}`.trim() : '';
        if (query) {
          this.query.setValue(query)
        }
      });
    }

    this._search.queryStream.subscribe((q: string) => {
      if (q) {
        this.query.setValue(q);
      }
    });


  }

  onSubmitSearch() {
    //const query = encodeURI(this.query!.value);
    const query = this.query!.value ? `${this.query!.value}`.trim() : '';

    if (query) {
      this._router.navigate(['/', 'browse', `${query}`]);
    } else {
      this._router.navigate(['/', 'browse']);
    }
  
  }


}
