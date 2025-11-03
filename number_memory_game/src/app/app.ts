import { Component, signal, computed, OnInit } from '@angular/core';


interface Cell {
  id: number;
  value: number | null;
  isActive: boolean;
}

type GameState = 'idle' | 'showing' | 'playing' | 'won' | 'lost';

@Component({
  selector: 'app-root',
 
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{
  // Costanti di gioco
  private readonly GRID_SIZE = 60;
  private readonly NUMBER_COUNT = 5;
  private readonly SHOW_TIME = 800; // millisecondi

  // Audio
  private readonly clickSound = new Audio('metal-button-push.mp3');
  private readonly winSound = new Audio('achievement-bell.mp3');
  private  readonly loseSound = new Audio('wrong-answer.mp3');

  // Stato del gioco con signal
  protected cells = signal<Cell[]>([]);
  protected gameState = signal<GameState>('idle');
  protected clickCounter = signal(0);
  protected startTime = signal(0);
  protected elapsedTime = signal(0);
  protected sortedNumbers = signal<number[]>([]);

  // Computed signals
  protected showNumbers = computed(() => this.gameState() === 'showing');
  protected isPlaying = computed(() => this.gameState() === 'playing');
  protected hasWon = computed(() => this.gameState() === 'won');
  protected hasLost = computed(() => this.gameState() === 'lost');
  protected canStart = computed(() => this.gameState() === 'idle' || this.gameState() === 'won' || this.gameState() === 'lost');

  constructor() {
 
  }
  ngOnInit(): void {
    this.initializeGrid();
  }

  // Inizializza la griglia vuota
  private initializeGrid(): void {
    const grid: Cell[] = [];
    for (let i = 1; i <= this.GRID_SIZE; i++) {
      grid.push({
        id: i,
        value: null,
        isActive: false
      });
    }
    this.cells.set(grid);
  }

  // Genera numeri casuali unici
  private getRandomNumbers(min: number, max: number, count: number): number[] {
    const numbers = new Set<number>();
    while (numbers.size < count) {
      numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return Array.from(numbers);
  }

  // Mescola un array
  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Inizia il gioco
  protected startGame(): void {
    if (!this.canStart()) return;

    // Reset
    this.initializeGrid();
    this.clickCounter.set(0);
    this.elapsedTime.set(0);
    this.gameState.set('showing');
    this.startTime.set(Date.now());

    // Seleziona 5 celle casuali
    const cellIds = this.getRandomNumbers(1, this.GRID_SIZE, this.NUMBER_COUNT);

    // Genera 5 numeri casuali da 1 a 9
    const numbers = this.getRandomNumbers(1, 9, this.NUMBER_COUNT);

    // Mescola i numeri per assegnarli casualmente alle celle
    const shuffledNumbers = this.shuffle(numbers);

    // Crea l'array ordinato per la validazione
    this.sortedNumbers.set([...numbers].sort((a, b) => a - b));

    // Aggiorna le celle
    const updatedCells = this.cells().map(cell => {
      const index = cellIds.indexOf(cell.id);
      if (index !== -1) {
        return {
          ...cell,
          value: shuffledNumbers[index],
          isActive: true
        };
      }
      return cell;
    });

    this.cells.set(updatedCells);

    // Dopo 800ms, nascondi i numeri e inizia il gioco
    setTimeout(() => {
      this.gameState.set('playing');
    }, this.SHOW_TIME);
  }

  // Gestisce il click su una cella
  protected onCellClick(cell: Cell): void {
    if (!this.isPlaying() || !cell.isActive || cell.value === null) return;

    // Riproduci suono del click
    this.playSound(this.clickSound);

    const currentCounter = this.clickCounter();
    const expectedNumber = this.sortedNumbers()[currentCounter];

    if (cell.value === expectedNumber) {
      // Click corretto
      this.clickCounter.set(currentCounter + 1);

      // Disattiva la cella cliccata
      const updatedCells = this.cells().map(c =>
        c.id === cell.id ? { ...c, isActive: false } : c
      );
      this.cells.set(updatedCells);

      // Controlla se ha vinto
      if (this.clickCounter() === this.NUMBER_COUNT) {
        this.gameState.set('won');
        this.elapsedTime.set(Date.now() - this.startTime());
        this.playSound(this.winSound);
      }
    } else {
      // Click sbagliato
      this.gameState.set('lost');
      this.playSound(this.loseSound);
    }
  }

  // Azzera il gioco
  protected resetGame(): void {
    this.initializeGrid();
    this.gameState.set('idle');
    this.clickCounter.set(0);
    this.elapsedTime.set(0);
    this.sortedNumbers.set([]);
  }

  // Riproduce un suono
  private playSound(audio: HTMLAudioElement): void {
    audio.currentTime = 0;
    audio.play().catch(err => console.error('Error playing sound:', err));
  }

  // Formatta il tempo in secondi con 2 decimali
  protected formatTime(ms: number): string {
    return (ms / 1000).toFixed(2);
  }
}
