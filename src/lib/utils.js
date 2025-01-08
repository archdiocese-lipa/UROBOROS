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
  inquery = {},
  select = "*",
}) => {
  try {
    // Calculate the range for pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Initialize the query for paginated items
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
    if (inquery) {
      if (Object.keys(inquery).length > 0) {
        for (const [column, values] of Object.entries(inquery)) {
          if (Array.isArray(values)) {
            // Ensure values is an array before applying .in()
            supabaseQuery = supabaseQuery.in(column, values);
          } else {
            console.error(
              `Expected an array for column ${column}, but got:`,
              values
            );
          }
        }
      }
    }

    // Apply the is_confirmed filter if provided
    if (filters.active && filters.active !== "all") {
      const isConfirmed = filters.active === "active";
      supabaseQuery = supabaseQuery.eq("is_confirmed", isConfirmed);
    }

    // Apply date filters (this is where the date filter is handled)
    if (filters.date) {
      // Assuming filters.date is in the 'YYYY-MM' format
      const [year, month] = filters.date.split("-");

      // Get the first day of the month
      const startOfMonth = `${year}-${month}-01`;

      // Get the last day of the month
      const lastDayOfMonth = new Date(year, month, 0).getDate(); // `month` is 0-indexed
      const endOfMonth = `${year}-${month}-${lastDayOfMonth}`;

      // Apply filtering based on the year and month
      supabaseQuery = supabaseQuery
        .gte("event_date", startOfMonth) // Filter events from the start of the month
        .lte("event_date", endOfMonth); // Filter events until the last day of the month
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
    // Apply distinct filters if provided

    // Apply ilike filters if provided
    if (filters.ilike) {
      for (const [column, value] of Object.entries(filters.ilike)) {
        supabaseQuery = supabaseQuery.ilike(column, `%${value}%`);
      }
    }

    // Apply eq filters dynamically for both the items and the count
    if (filters.eq) {
      const { column, value } = filters.eq;
      supabaseQuery = supabaseQuery.eq(column, value);
    }

    // Apply 'id' filters (this is where your fix is integrated)
    if (filters.id) {
      supabaseQuery = supabaseQuery.in("id", filters.id);
    }

    // Fetch the total count of items, applying eq filters here as well
    let countQuery = supabase
      .from(key)
      .select("*", { count: "exact", head: true });

    // Apply eq filters to the count query
    if (filters.eq) {
      const { column, value } = filters.eq;
      countQuery = countQuery.eq(column, value);
    }

    const { count, error: countError } = await countQuery;

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
 * Gets first initial of a name.
 * @returns {string} The initial of a name.
 */
const getInitial = (name) => {
  return name
    ?.split(" ")
    .map((word) => word[0])[0]
    .toUpperCase();
};

export { cn, paginate, getInitial };
