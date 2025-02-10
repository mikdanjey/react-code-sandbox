import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";

export const ProductForm = () => {
    const { register, handleSubmit, control, reset } = useForm();
    const [products, setProducts] = useState([]);

    function fetchProducts() {
        axios.get("/api/products")
            .then(response => setProducts(response.data))
            .catch(error => console.error("Error fetching products:", error));
    }

    // Fetch existing products for dropdown
    useEffect(() => {
        fetchProducts();
    }, []);

    // Form submit handler
    const onSubmit = async (data) => {
        try {
            await axios.post("/api/products", {
                name: data.name,
                price: parseFloat(data.price),
                category: data.category,
                relevantProductName: data.relevantProduct || null,
            });
            fetchProducts();
            alert("Product created successfully!");
            reset();
        } catch (error) {
            console.error("Error creating product:", error);
            alert("Failed to create product");
        }
    };

    return (
        <div>
            <h2 className="text-center">Add Products</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded-lg shadow-md max-w-md mx-auto">
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                        {...register("name", { required: true })}
                        type="text"
                        placeholder="Enter product name"
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                        {...register("price", { required: true })}
                        type="number"
                        placeholder="Enter price"
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input
                        {...register("category", { required: true })}
                        type="text"
                        placeholder="Enter category"
                        className="w-full p-2 border rounded"
                        value="Medical"
                    />
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700">Relevant Product (Optional)</label>
                    <Controller
                        name="relevantProduct"
                        control={control}
                        render={({ field }) => (
                            <select {...field} className="w-full p-2 border rounded">
                                <option value="">Select a product</option>
                                {products.map((p, index) => (
                                    <option key={index} value={p.name}>{p.name}</option>
                                ))}
                            </select>
                        )}
                    />
                </div>

                <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
                    Create Product
                </button>
            </form>
        </div>
    );
};
