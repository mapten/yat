export interface Priority {
  /** The order to display. The lowest, the most prioritizing is */
  order: number;
  displayText: string;
  displayColor: string;
  isDefaultSelected: boolean;
}