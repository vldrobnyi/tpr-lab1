import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { min } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tpr-lab1';
  elements: number = 4;
  relation: number[][] = [];

  isReflexive: boolean = false;
  isIrreflexive: boolean = false;
  isSymmetric: boolean = false;
  isTransitive: boolean = false;
  isAsymmetric: boolean = false;
  isAntisymmetric: boolean = false;

  bestElements: number[] = [];
  worstElements: number[] = [];
  maxElements: number[] = [];
  minElements: number[] = [];

  strictR: number[][] = [];
  invertedR: number[][] = [];
  additivR: number[][] = [];
  r_2: number[][] = [];

  isCalculated: boolean = false;

  constructor() {
    this.generateMatrix();
  }

  generateMatrix() {
    let relClone  = Object.assign([], this.relation);
    this.relation = [];
    for(let i = 0; i < this.elements; i++) {
      this.relation.push([]);
      for(let j = 0; j < this.elements; j++) {
        if (relClone[i] && relClone[i][j]) {
          this.relation[i].push(relClone[i][j]);
        }
        else {
          this.relation[i].push(0);
        }
      }
    }
  }

  calculate() {
    this.isReflexive = this.checkReflexive();
    this.isIrreflexive = this.checkIrreflexive();
    this.isSymmetric = this.checkSymmetric();
    this.isTransitive = this.checkTransitive();
    this.isAsymmetric = this.checkAsymmetric();
    this.isAntisymmetric = this.checkAntisymmetric();

    this.strictR = this.strictRelation(this.relation);
    this.invertedR = this.transpose(this.relation);
    this.additivR = this.additiveRelation(this.relation);
    this.r_2 = this.composition(this.relation, this.relation);

    this.findBestElements();
    this.findWorstElements();
    this.findMaxElements(this.strictR);
    this.findMinElements(this.strictR);

    this.isCalculated = true;
  }

  composition(r1: number[][], r2: number[][]) {
    let result: number[][] = [];
    let curRow = 0;
    for (let i = 0; i < r1.length; i++) {
      result.push([]);
      for (let j = 0; j < r2.length; j++) {
        let mins = [];
        for (let k = 0; k < r1.length; k++) {
          mins.push(Math.min(r1[i][k], r2[k][j]));
        }
        result[curRow].push(Math.max(...mins));
      }
      curRow++;
    }
    return result;
  }

  findBestElements() {
    this.bestElements = [];
    for (let i = 0; i < this.elements; i++) {
      let isBest = true;
      for (let j = 0; j < this.elements; j++) {
        if (this.relation[i][j] == 0) {
          isBest = false;
          break;
        }
      }
      if (isBest) {
        this.bestElements.push(i);
      }
    }
  }

  findWorstElements() {
    this.worstElements = [];
    for (let i = 0; i < this.elements; i++) {
      let isWorst = true;
      for (let j = 0; j < this.elements; j++) {
        if (this.relation[j][i] == 0) {
          isWorst = false;
          break;
        }
      }
      if (isWorst) {
        this.worstElements.push(i);
      }
    }
  }

  findMaxElements(strictR: number[][]) {
    this.maxElements = [];
    for (let i = 0; i < this.elements; i++) {
      let isMax = true;      
      for (let j = 0; j < this.elements; j++) {
        if (strictR[j][i] == 1) {
          isMax = false;
          break;
        }
      }
      if (isMax) {
        this.maxElements.push(i);
      }
    }
  }

  findMinElements(strictR: number[][]) {
    this.minElements = [];
    for (let i = 0; i < this.elements; i++) {
      let isMin = true;
      for (let j = 0; j < this.elements; j++) {
        if (strictR[i][j] == 1) {
          isMin = false;
          break;
        }
      }
      if (isMin) {
        this.minElements.push(i);
      }
    }
  }

  strictRelation(r: number[][]): number[][] {
    let result: number[][] = [];
    for(let i = 0; i < r.length; i++) {
      result.push([]);
      for(let j = 0; j < r.length; j++) {
        let value = r[i][j] - r[j][i];
        result[i][j] = value <= 0 ? 0 : 1;
      }
    }
    return result;
  }

  additiveRelation(r: number[][]): number[][] {
    let result: number[][] = [];
    for(let i = 0; i < r.length; i++) {
      result.push([]);
      for(let j = 0; j < r.length; j++) {
        result[i].push(1 - r[i][j]);
      }
    }
    return result;
  }

  combineRelations(r1: number[][], r2: number[][]): number[][] {
    const result: number[][] = [];
    for(let i = 0; i < r1.length; i++) {
      result.push([]);
      for(let j = 0; j < r1.length; j++) {
        result[i][j] = r1[i][j] || r2[i][j];
      }
    }
    return result;
  }

  crossRelations(r1: number[][], r2: number[][]): number[][] {
    const result: number[][] = [];
    for(let i = 0; i < r1.length; i++) {
      result.push([]);
      for(let j = 0; j < r1.length; j++) {
        result[i][j] = r1[i][j] && r2[i][j];
      }
    }
    return result;
  }

  transpose(matrix: number[][]): number[][] {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  }

  checkReflexive(): boolean {
    for(let i = 0; i < this.elements; i++) {
      if (this.relation[i][i] != 1) {
        return false;
      }
    }
    return true;
  }

  checkIrreflexive(): boolean {
    for(let i = 0; i < this.elements; i++) {
      if (this.relation[i][i] != 0) {
        return false;
      }
    }
    return true;
  }

  checkSymmetric(): boolean {
    for(let i = 0; i < this.elements; i++) {
      for (let j = 0; j < this.elements; j++) {
        if (this.relation[i][j] != this.relation[j][i]) {
          return false;
        }
      }
    }
    return true;
  }  

  checkAsymmetric(): boolean {
    if (!this.isIrreflexive) {
      return false;
    }
    const rT = this.transpose(this.relation);
    const crossedRelations = this.crossRelations(this.relation, rT);
    for (let i = 0; i < this.elements; i++) {
      for (let j = 0; j < this.elements; j++) {
        if (crossedRelations[i][j] == 1) {
          return false;
        }
      }
    }
    return true;
  }

  checkAntisymmetric(): boolean {
    for (let i = 0; i < this.elements; i++) {
      for (let j = 0; j < this.elements; j++) {
        if (i == j) {
          continue;
        }
        if ((this.relation[i][j] && this.relation[j][i]) == 1) {
          return false;
        }
      }
    }
    return true;
  }

  checkTransitive(): boolean {
    const r2 = this.composition(this.relation, this.relation);
    for (let i = 0; i < this.elements; i++) {
      for (let j = 0; j < this.elements; j++) {
        if (r2[i][j] > this.relation[i][j]) {
          return false;
        }
      }
    }
    return true;
  }
}
