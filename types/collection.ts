export type Item = {
  name: string;
  type: string;
  price: number;
  image: string;
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
