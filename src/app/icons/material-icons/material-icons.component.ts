import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-material-icons',
    templateUrl: './material-icons.component.html',
    styleUrls: ['./material-icons.component.sass'],
    imports: [RouterLink]
})
export class MaterialIconsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
