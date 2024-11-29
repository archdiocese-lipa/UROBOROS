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
const paginate = async ({
  key,
  page = 1,
  pageSize = 10,
  query = {},
  filters = {},
  order = [],
  select = "*",
}) => {
  try {
    // Calculate the range for pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Initialize the query
    let supabaseQuery = supabase
      .from(key)
      .select(select)
      .range(from, to)
      .match(query);

    // Apply ordering dynamically
    if (order.length > 0) {
      order.forEach(({ column, ascending }) => {
        supabaseQuery = supabaseQuery.order(column, { ascending });
      });
    }
    // Apply the is_confirmed filter if provided
    if (filters.active && filters.active !== "all") {
      // Filter by `is_confirmed` column based on activeFilter value
      const isConfirmed = filters.active === "active"; // Map activeFilter to is_confirmed value
      supabaseQuery = supabaseQuery.eq("is_confirmed", isConfirmed);
    }

    // Apply gte and lte filters if provided
    if (filters.gte) {
      for (const [column, value] of Object.entries(filters.gte)) {
        supabaseQuery = supabaseQuery.gte(column, value);
      }
    }

    if (filters.lte) {
      for (const [column, value] of Object.entries(filters.lte)) {
        supabaseQuery = supabaseQuery.lte(column, value);
      }
    }

    // Apply ilike filters if provided
    if (filters.ilike) {
      for (const [column, value] of Object.entries(filters.ilike)) {
        supabaseQuery = supabaseQuery.ilike(column, `%${value}%`);
      }
    }

    if (filters.eq) {
      for (const [column, value] of Object.entries(filters.eq)) {
        supabaseQuery = supabaseQuery.eq(column, value);
      }
    }

    if (filters.in) {
      for (const [column, value] of Object.entries(filters.in)) {
        supabaseQuery = supabaseQuery.in(column, value);
      }
    }

    // Fetch the total count of items
    const { count, error: countError } = await supabase
      .from(key)
      .select("*", { count: "exact", head: true });

    if (countError) throw countError;

    // Fetch the paginated items
    const { data: items, error: itemsError } = await supabaseQuery;

    if (itemsError) throw itemsError;

    // Calculate the total number of pages
    const totalPages = Math.ceil(count / pageSize);

    // Determine if there is a next page
    const nextPage = page < totalPages;

    return {
      items, // data
      currentPage: page, // page
      nextPage, // true or false
      totalPages,
      pageSize,
      totalItems: count,
    };
  } catch (error) {
    console.error("Error paginating items:", error.message);
    throw error;
  }
};
/**
 * Paginate items from a Supabase table.
 * @returns {string} The paginated items and pagination properties.
 */
const getInitial = (name) => {
  return name
    ?.split(" ")
    .map((word) => word[0])[0]
    .toUpperCase();
};

export { cn, paginate, getInitial };
