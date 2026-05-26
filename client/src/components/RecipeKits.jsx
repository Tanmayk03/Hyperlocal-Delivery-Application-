import React, { useState } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { useGlobalContext } from '../provider/GlobalProvider';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BsCartPlus } from 'react-icons/bs';

const RECIPES = [
  {
    id: "chai_toast",
    title: "Chai & Toast Combo",
    description: "Tata Tea Agni Special Blend and Kwality Whole Wheat Bread. Perfect breakfast combo.",
    queries: ["tea", "bread"],
    priceEstimate: "₹85",
    bgColor: "from-amber-50 to-orange-100/60 border-amber-200/50",
    badgeColor: "bg-amber-600 text-amber-50"
  },
  {
    id: "sweet_savory",
    title: "Sweet & Savory Snack Kit",
    description: "Cadbury Dairy Milk Chocolate and Balaji Ratlami Sev. Satiate your sweet and salty cravings.",
    queries: ["chocolate", "sev"],
    priceEstimate: "₹65",
    bgColor: "from-yellow-50 to-amber-100/50 border-yellow-200/50",
    badgeColor: "bg-yellow-600 text-yellow-50"
  },
  {
    id: "breakfast_coffee",
    title: "Coffee & Bread Combo",
    description: "Continental Xtra Coffee and Kwality Whole Wheat Bread. A classic high energy morning start.",
    queries: ["coffee", "bread"],
    priceEstimate: "₹120",
    bgColor: "from-green-50 to-emerald-100/50 border-green-200/50",
    badgeColor: "bg-green-600 text-green-50"
  }
];

const RecipeKits = () => {
  const globalContext = useGlobalContext();
  const { fetchCartItem } = globalContext || {};
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const [loadingRecipeId, setLoadingRecipeId] = useState(null);

  const handleAddRecipeIngredients = async (recipe) => {
    if (!user?._id) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }

    setLoadingRecipeId(recipe.id);
    const toastId = toast.loading(`Adding ${recipe.title} ingredients...`);

    try {
      const addedItems = [];
      const failedItems = [];

      for (const query of recipe.queries) {
        try {
          // 1. Search for matching product
          const searchRes = await Axios({
            ...SummaryApi.searchProduct,
            data: { search: query, page: 1 }
          });

          if (searchRes.data?.success && searchRes.data.data?.[0]) {
            const product = searchRes.data.data[0];

            // 2. Add to cart
            try {
              const addRes = await Axios({
                ...SummaryApi.addTocart,
                data: { productId: product._id }
              });

              if (addRes.data?.success) {
                addedItems.push(product.name);
              }
            } catch (addErr) {
              // 400 means item already in cart
              if (addErr.response?.status === 400 || addErr.response?.data?.message?.includes("already")) {
                addedItems.push(`${product.name} (already in cart)`);
              } else {
                failedItems.push(query);
                console.error(`Error adding ${product.name} to cart:`, addErr);
              }
            }
          } else {
            failedItems.push(query);
          }
        } catch (searchErr) {
          failedItems.push(query);
          console.error(`Error searching for ${query}:`, searchErr);
        }
      }

      if (addedItems.length > 0) {
        let msg = `Processed ingredients for ${recipe.title}!`;
        if (failedItems.length > 0) {
          msg += ` (Note: ${failedItems.join(", ")} out of stock)`;
        }
        toast.success(msg, { id: toastId, duration: 4000 });
        fetchCartItem?.();
      } else {
        toast.error("Could not find matching ingredients in stock.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed: ${err.message}`, { id: toastId });
    } finally {
      setLoadingRecipeId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Cook in 10 Minutes</h2>
        <p className="text-sm text-slate-500">Add all fresh ingredients for these recipes in just one click</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {RECIPES.map((recipe) => (
          <div 
            key={recipe.id}
            className={`rounded-2xl p-6 border bg-gradient-to-br flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 ${recipe.bgColor}`}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${recipe.badgeColor}`}>
                  Meal Kit
                </span>
                <span className="text-sm font-extrabold text-slate-700">{recipe.priceEstimate} est.</span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-2">{recipe.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">{recipe.description}</p>
            </div>

            <button
              onClick={() => handleAddRecipeIngredients(recipe)}
              disabled={loadingRecipeId !== null}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 text-xs shadow-sm hover:shadow"
            >
              <BsCartPlus size={16} />
              {loadingRecipeId === recipe.id ? "Adding..." : "Add Ingredients to Cart"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeKits;
