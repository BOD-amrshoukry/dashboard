export interface ModalDataType {
  head: string;
  description: string;
  type: 'single' | 'multiple';
  action: string;
  value: any; // or more specific type
  ids?: string | string[]; // depending on single/multiple
  id?: string | string[];
}

