import ProductCard from "./ProductCard";

const ProductGrid = ({ products }) => {

  if (!products.length) {
    return (
      <div className="py-20 text-center">
        <h3 className="font-serif text-2xl text-maroon-900">
          No products found
        </h3>

        <p className="text-gray-500 mt-2">
          Try another search or category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">

      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}

    </div>
  );
};

export default ProductGrid;