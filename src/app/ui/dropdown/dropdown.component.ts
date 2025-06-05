import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownAnchor, NgbDropdownItem } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.sass'],
    imports: [
        RouterLink,
        NgbDropdown,
        NgbDropdownToggle,
        NgbDropdownMenu,
        NgbDropdownAnchor,
        NgbDropdownItem,
        FormsModule,
    ]
})
export class DropdownComponent implements OnInit {
  constructor() {}
  myDrop: any;
  myDrop1: any;
  ngOnInit(): void {}
}
