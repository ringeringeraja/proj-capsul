export interface OptionsInterface {
  id: number;
  controls?: boolean;
  byline?: boolean;
  portrait?: boolean;
  title?: boolean;
}

export interface PlayerInterface {
  options: OptionsInterface;
}
