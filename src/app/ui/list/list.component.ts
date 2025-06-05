import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.sass'],
    imports: [RouterLink]
})
export class ListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
