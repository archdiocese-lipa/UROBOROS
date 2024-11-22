import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "@/services/supabaseClient";

const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

/**
 * Paginate items from a Supabase table.
 * @param {string} key - The table name.
 * @param {number} page - The current page number.
 * @param {number} pageSize - The number of items per page.
 * @param {object} [query] - Additional query parameters.
 * @returns {Promise<object>} The paginated items and pagination properties.
 * @throws {Error} If an error occurs while fetching the items.
 */
const paginate = async (key, page = 1, pageSize = 10, query = {}) => {
  try {
    // Calculate the range for pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Fetch the total count of items
    const { count, error: countError } = await supabase
      .from(key)
      .select("*", { count: "exact", head: true });

    if (countError) throw countError;

    // Fetch the paginated items
    const { data: items, error: itemsError } = await supabase
      .from(key)
      .select("*")
      .range(from, to)
      .match(query);

    if (itemsError) throw itemsError;

    // Calculate the total number of pages
    const totalPages = Math.ceil(count / pageSize);

    // Determine if there is a next page
    const nextPage = page < totalPages;

    return {
      items,
      currentPage: page,
      nextPage,
      totalPages,
      pageSize,
      totalItems: count,
    };
  } catch (error) {
    console.error("Error paginating items:", error.message);
    throw error;
  }
};

export { cn, paginate };
