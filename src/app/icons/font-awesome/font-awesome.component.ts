import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-font-awesome',
    templateUrl: './font-awesome.component.html',
    styleUrls: ['./font-awesome.component.sass'],
    imports: [RouterLink]
})
export class FontAwesomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
