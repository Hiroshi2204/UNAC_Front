import { Component, OnInit } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.sass'],
    imports: [RouterLink, NgbCollapse]
})
export class CardComponent implements OnInit {
  public isCollapsed = false;
  constructor() {}

  ngOnInit(): void {}
}
