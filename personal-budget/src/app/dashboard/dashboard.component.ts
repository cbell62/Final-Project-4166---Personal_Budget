import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'chart.js';
import { DataService } from '../services/data.service';
import { ErrorService } from '../services/error.service';
import { Budget } from '../services/budget';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'pb-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements AfterViewInit {
  errorMessage = '';
  allBudget: Budget[] = [];
  titles = [];
  budget = [];
  expenses = [];
  colors = [];

  constructor(public dataService: DataService,
              private route: ActivatedRoute,
              private router: Router,
              public errorService: ErrorService,
              public authService: AuthService) { }

  ngAfterViewInit(): void {
    this.dataService.getAllBudgetData().subscribe({
      next: budget => {
        this.allBudget = budget;
        this.populateChartData();
        this.createPieChart();
        this.createRadarChart();
        this.createMixedChart();
      },
      error: err => this.errorMessage = err
    });
  }

  populateChartData(): void {
    for (let i = 0; i < this.allBudget.length; i++) {
      this.titles[i] = this.allBudget[i].title;
      this.budget[i] = this.allBudget[i].budget;
      this.expenses[i] = this.allBudget[i].expenses;
      this.colors[i] = this.allBudget[i].color;
    }
  }

  createPieChart(): void {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.titles,
          datasets: [
            {
            data: this.budget,
            backgroundColor: this.colors,
          },
      ],
    },
  });
  }

  createRadarChart(): void {
    const canvas = document.getElementById('radar') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const myRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: this.titles,
          datasets: [
            {
            label: 'Budget',
            data: this.budget,
            borderColor: '#790149',
            pointBorderColor: this.colors,
            pointRadius: 5,
            backgroundColor: 'rgba(255, 0, 0, 0.1)'
          },
          {
            label: 'Expenses',
            data: this.expenses,
            pointBorderColor: this.colors,
            pointRadius: 5,
            borderColor: '#005Fcc',
            backgroundColor: 'rgba(0, 255, 0, 0.1)'
          },
      ],
    },
  });
  }

  createMixedChart(): void {
    const canvas = document.getElementById('mixed') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const myRadarChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.titles,
          datasets: [
            {
            label: 'Budget',
            data: this.budget,
            backgroundColor: this.colors,
          },
          {
            label: 'Expenses',
            data: this.expenses,
            borderWidth: 2,
            borderColor: this.colors,
            type: 'bar',
            fill: false,
            pointRadius: 10
          },
        ],
      },
    });
  }

  addExpense(budget: Budget, expense: number) {
    budget.expenses = +budget.expenses + +expense;
    this.dataService.updateBudget(budget)
    .subscribe({
      next: () => this.onSaveComplete(),
      error: err => this.errorMessage = err
    });
    console.log('Add expense clicked', expense, budget.id);
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    // this.newExpense.reset();
    this.router.navigate(['/dashboard'])
    .then(() => {
      window.location.reload();
    });
  }

  resetExpenses() {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.allBudget.length; i++) {
      this.allBudget[i].expenses = 0;
      this.dataService.updateBudget(this.allBudget[i])
        .subscribe({
          next: () => this.onSaveComplete(),
          error: err => this.errorMessage = err
        });
    }
  }

}
