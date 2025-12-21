import { Button } from "@client/ui";
import { Product } from "@client/types";

const p: Product = { id: "1", title: "Sneakers", price: 99, slug: "sneakers" };

export default function Home() {
  return (
    <main>
      <h1>{p.title}</h1>
      <Button variant="contained">Buy Now</Button>
    </main>
  );
}
