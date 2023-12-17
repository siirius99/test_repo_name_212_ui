import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appIntegerInput][type="number"]'
})
export class IntegerInputDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const inputValue = inputElement.value;

    // Remove any non-digit characters
    const sanitizedValue = inputValue.replace(/[^0-9]/g, '');

    // Update the input value without triggering another 'input' event
    inputElement.value = sanitizedValue;

    // If the value was modified, update the model value
    if (inputValue !== sanitizedValue) {
      inputElement.dispatchEvent(new Event('input'));
    }
  }
}
