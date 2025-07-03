
import { Directive, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { TopbarService } from './topbar.service';

@Directive({
  selector: '[appBannerObserver]'
})

export class BannerObserverDirective implements AfterViewInit, OnDestroy {

  /** Guardamos la referencia para poder hacer `disconnect()` */
  private io?: IntersectionObserver;

  constructor(
    private el: ElementRef,
    private topbar: TopbarService,
  ) {}

  ngAfterViewInit(): void {
    this.io = new IntersectionObserver(
      ([entry]) => this.topbar.setVisible(entry.isIntersecting),
      { threshold: 0 }
    );

    this.io.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}
