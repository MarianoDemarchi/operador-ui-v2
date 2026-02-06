export interface AppMenuItem {
  id: number;
  label: string;
  direction: string;
  icon: string;
  children?: AppMenuItem[];
}
