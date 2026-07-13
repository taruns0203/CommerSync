import { Product } from "@commersync/types";

import { Button } from "@client/ui";

const p: Product = {
  id: "1",
  name: "Sneakers",
  price: 99,
  slug: "sneakers",
  sku: "SNK-001",
  description: "Comfortable sneakers",
  categoryId: "shoes",
  stock: 10,
  images: [],
};

export default function Home() {
  return (
    <main>
      <h1>{p.name}</h1>
      <Button variant="contained">Buy Now New Deployment</Button>
    </main>
  );
}
