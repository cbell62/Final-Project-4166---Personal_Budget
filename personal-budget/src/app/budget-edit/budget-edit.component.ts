import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Budget } from '../services/budget';
import { DataService } from '../services/data.service';

import { HexValidator } from '../services/hex.validator';
import { GenericValidator } from '../services/generic-validator';

@Component({
  selector: 'pb-budget-edit',
  templateUrl: './budget-edit.component.html',
  styleUrls: ['./budget-edit.component.scss']
})
export class BudgetEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle = 'Budget Edit';
  errorMessage: string;
  budgetForm: FormGroup;

  budget: Budget;
  private sub: Subscription;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private dataService: DataService) {

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      title: {
        required: 'Title is required.',
        minlength: 'Product name must be at least three characters.',
        maxlength: 'Product name cannot exceed 50 characters.'
      },
      budget: {
      required: 'Budget is required.'
      },
      color: {
        required: 'Color is required.',
        hexFormat: 'Color must be a valid hex code'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.budgetForm = this.fb.group({
      title: ['', [Validators.required,
                         Validators.minLength(3),
                         Validators.maxLength(50)]],
      budget: ['', Validators.required],
      color: ['', [Validators.required,
                          HexValidator.hexFormat()]],
    });

    // Read the product Id from the route parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getBudget(id);
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.budgetForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.budgetForm);
    });
  }

  getBudget(id: number): void {
    this.dataService.getBudget(id)
      .subscribe({
        next: (budget: Budget) => this.displayBudget(budget[0], id),
        error: err => this.errorMessage = err
      });
  }

  displayBudget(budget: Budget, id: number): void {
    if (this.budgetForm) {
      this.budgetForm.reset();
    }
    this.budget = budget;

    if (id === 0) {
      this.pageTitle = 'Add Budget';
      // console.log('Add budget id', budget);
    } else {
      this.pageTitle = `Edit Budget: ${this.budget.title}`;
          // Update the data on the form
      this.budgetForm.patchValue({
        title: this.budget.title,
        budget: this.budget.budget,
        color: this.budget.color
      });
    }

  }

  deleteBudget(): void {
    if (this.budget.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete();
    } else {
      if (confirm(`Really delete the product: ${this.budget.title}?`)) {
        this.dataService.deleteBudget(this.budget.id)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
      }
    }
  }

  saveBudget(): void {
    if (this.budgetForm.valid) {
      if (this.budgetForm.dirty) {
        const b = { ...this.budget, ...this.budgetForm.value };

        if (b.id === 0) {
          this.dataService.createBudget(b)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        } else {
          this.dataService.updateBudget(b)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.budgetForm.reset();
    this.router.navigate(['/dashboard']);
  }


}
