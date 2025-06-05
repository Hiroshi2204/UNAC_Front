import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-badges',
    templateUrl: './badges.component.html',
    styleUrls: ['./badges.component.sass'],
    imports: [RouterLink]
})
export class BadgesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
