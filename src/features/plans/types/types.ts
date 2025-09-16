export interface Plan {
  id: number;
  documentId: string;
  name: string;
  description: string;
  isActive: boolean;
  planId: number;
  features: {
    features: string[];
  };
  price: number;
}

