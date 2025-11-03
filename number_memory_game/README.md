# Number Memory Game

Un gioco per testare la memoria fotografica umana, ispirato all'esperimento condotto con lo scimpanzé Ayumu. Il giocatore deve ricordare la posizione di 5 numeri mostrati per soli 210ms e cliccarli in ordine crescente.

## Descrizione

Questo progetto ricrea l'esperienza dell'esperimento sulla memoria fotografica condotto con Ayumu, ma adattato per gli esseri umani utilizzando 5 numeri casuali invece di una sequenza più complessa.

## Regole del Gioco

1. **Inizio**: L'utente clicca sul bottone "Inizia"
2. **Memorizzazione**: Vengono mostrati 5 numeri casuali (da 1 a 9) in posizioni casuali su una griglia 10x10 per **210ms**
3. **Sfida**: Dopo 210ms, i numeri vengono nascosti (le celle diventano bianche)
4. **Obiettivo**: Cliccare sui numeri **in ordine crescente**
5. **Vittoria**: Se tutti i 5 numeri vengono cliccati nell'ordine corretto
6. **Sconfitta**: Se si clicca su un numero maggiore di uno dei numeri non ancora cliccati

## Specifiche Tecniche

### Layout
- **Griglia**: 10x10 celle (100 celle totali)
- **Background**: Colore scuro (dark)
- **Celle attive**: Background dark durante la visualizzazione, white dopo
- **Numeri**: Colore white
- **Celle ID**: Numerate da 1 a 100

### Audio
- `metal-button-push.mp3`: Click su una cella
- `achievement-bell.mp3`: Vittoria
- `wrong-answer.mp3`: Sconfitta

### Logica di Implementazione

1. Generazione casuale di 5 numeri da 1 a 100 (ID delle celle selezionate)
2. Generazione casuale di 5 numeri da 1 a 9 (valori da mostrare)
3. Assegnazione casuale dei valori alle celle selezionate
4. Creazione di un array ordinato crescente con i 5 numeri generati
5. Utilizzo di un contatore per verificare la sequenza dei click
6. Confronto: `array_numeri_ordinati[contatore] === contenuto_cella_cliccata`

### Controlli

- **Bottone "Inizia"**: Avvia il gioco (in basso a sinistra)
- **Timer**: Mostra "Ci hai messo: X" - tempo dal click su "Inizia" fino al completamento (in basso al centro, visibile solo in caso di vittoria)
- **Bottone "Azzera"**: Resetta il gioco (in basso a destra)

## Tecnologie

- **Framework**: Angular
- **Linguaggio**: TypeScript
- **Styling**: SCSS

## Installazione e Avvio

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
ng serve

# Apri il browser su
http://localhost:4200
```

## Sviluppo Futuro

Possibili miglioramenti:
- Livelli di difficoltà (variare numeri, tempo di visualizzazione, dimensione griglia)
- Classifica dei migliori tempi
- Statistiche di performance 