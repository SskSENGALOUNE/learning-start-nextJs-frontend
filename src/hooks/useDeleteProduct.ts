import { productService } from "@/lib/services/productService";
import { useState } from "react";

export const useDeleteProduct = () => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (id: number) => {
    setDeleting(true);
    setError(null);
    try {
      await productService.remove(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return { remove, deleting, error };
};
