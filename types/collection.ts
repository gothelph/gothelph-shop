export type Item = {
  title: string;
  type?: string;
  price?: number;
  image: string | null;
};

export type Subcollection = {
  id: string;
  title: string;
  description: string;
  items: Item[];
};

export type Collection = {
  id: string;
  title: string;
  description: string;
  subcollections: Subcollection[];
};
