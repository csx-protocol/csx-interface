import { Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { TemplateRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Directive({
  selector: '[appCustomTooltip]',
})
export class CustomTooltipDirective implements OnDestroy {
  @Input('appCustomTooltip') templateRef?: TemplateRef<any>;

  private overlayRef?: OverlayRef;
  private tooltipVisible = false;
  private destroyTimeout?: any;

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private overlay: Overlay,
    private changeDetectorRef: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {
    this.elementRef.nativeElement.addEventListener('mouseenter', this.showTooltip);
    this.elementRef.nativeElement.addEventListener('mouseleave', this.hideTooltip);
  }

  ngOnDestroy(): void {
    this.disposeTooltip();
  }

  private createTooltip(): void {
    this.disposeTooltip();

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([{ originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 8 }]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
      backdropClass: '',
    });

    if (!this.templateRef) {
      return;
    }

    const templatePortal = new TemplatePortal(this.templateRef, this.viewContainerRef);
    this.overlayRef.attach(templatePortal);
    this.overlayRef.overlayElement.style.display = 'none';

    this.overlayRef.overlayElement.addEventListener('mouseenter', this.showTooltip);
    this.overlayRef.overlayElement.addEventListener('mouseleave', this.hideTooltip);
  }

  private disposeTooltip(): void {
    if (this.overlayRef) {
      this.overlayRef.overlayElement.removeEventListener('mouseenter', this.showTooltip);
      this.overlayRef.overlayElement.removeEventListener('mouseleave', this.hideTooltip);
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
  }

  private showTooltip = () => {
    clearTimeout(this.destroyTimeout); // Clear the destroy timeout
    if (!this.overlayRef) {
      this.createTooltip(); // Create the tooltip if it doesn't exist
    }
    this.tooltipVisible = true;
    setTimeout(() => {
      if (this.tooltipVisible && this.overlayRef) {
        this.overlayRef.updatePosition();
        this.overlayRef.overlayElement.style.display = 'block';
        //this.changeDetectorRef.detectChanges(); // Manually trigger change detection
      }
    }, 50);
  };

  private hideTooltip = () => {
    this.tooltipVisible = false;
    setTimeout(() => {
      if (!this.tooltipVisible && this.overlayRef) {
        this.overlayRef.overlayElement.style.display = 'none';
      }
    }, 50);
    this.destroyTimeout = setTimeout(() => {
      if (!this.tooltipVisible) {
        this.disposeTooltip(); // Destroy the tooltip after 1 minute if not visible
      }
    }, 60000);
  };
}
