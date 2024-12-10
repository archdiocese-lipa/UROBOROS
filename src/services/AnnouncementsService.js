import { paginate } from "@/lib/utils";
import { supabase } from "./supabaseClient";

/**
 * Creates a new announcement and uploads associated files to Supabase storage.
 * Also associates the announcement with ministries via the `announcement_ministries` table.
 *
 * @param {Object} params - The parameters for creating an announcement.
 * @param {Object} params.announcementData - The data for the announcement.
 * @param {string} params.announcementData.title - The title of the announcement.
 * @param {string} params.announcementData.content - The content of the announcement.
 * @param {string} params.announcementData.visibility - The visibility of the announcement (e.g., 'public').
 * @param {File} [params.announcementData.file] - The file to be uploaded (optional).
 * @param {string[]} params.announcementData.ministry - Array of ministry IDs to associate with the announcement.
 * @param {string} params.user_id - The ID of the user creating the announcement.
 *
 * @throws {Error} If there is an error during the file upload, announcement creation, or ministry association.
 */
export const createAnnouncements = async ({ announcementData, user_id }) => {
  let filepath = "";
  let fileName = "";

  if (announcementData.file) {
    // Gets the file name and file extension
    const fileNameWihoutExt = announcementData.file.name.split(".")[0];
    const fileExt = announcementData.file.name.split(".")[1];
    // Sets the file name using the date and the file name
    fileName = `${fileNameWihoutExt}${Date.now()}.${fileExt}`;
    const bucketName = "Uroboros";

    // Upload file in the supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(`announcement/${fileName}`, announcementData.file);

    if (uploadError) {
      throw new Error(`Error uploading file: ${uploadError.message}`);
    }

    filepath = uploadData.path;
  }

  const { data, error } = await supabase
    .from("announcement")
    .insert([
      {
        title: announcementData.title,
        content: announcementData.content,
        visibility: announcementData.visibility,
        user_id,
        file_name: fileName,
        file_type: announcementData.file.type,
        file_path: filepath,
      },
    ])
    .select("*")
    .single();

  if (error) {
    console.error("Error inserting announcement:", error.message);
    throw error;
  }

  //connect ministry Ids to announcement Id in backend
  const insertPromises = announcementData.ministry.map(async (ministry_id) => {
    const { error: insertError } = await supabase
      .from("announcement_ministries")
      .insert([
        {
          announcement_id: data.id,
          ministry_id,
        },
      ]);

    if (insertError) {
      console.error("Error inserting into Announcement_Groups:", insertError);
      throw insertError;
    }
  });

  await Promise.all(insertPromises);
};

/**
 * Fetches a paginated list of announcements, optionally filtering by ministry.
 * Combines public announcements and announcements associated with specific ministries.
 *
 * @param {number} page - The current page number for pagination.
 * @param {number} pageSize - The number of items per page for pagination.
 * @param {string | string[]} ministry_id - The ministry ID(s) to filter by. If an array, fetches announcements associated with any of the given ministries.
 *
 * @returns {Promise<Object>} A paginated list of announcements, with file URLs and pagination details.
 * @returns {Array} return.items - Array of announcement objects with file URLs.
 * @returns {number} return.pageSize - The number of items per page.
 * @returns {number} return.nextPage - The next page number for pagination.
 * @returns {number} return.totalItems - The total number of announcements across all pages.
 * @returns {number} return.totalPages - The total number of pages.
 * @returns {number} return.currentPage - The current page number.
 *
 * @throws {Error} If there is an error while fetching announcements.
 */
export const fetchAnnouncements = async (page, pageSize, ministry_id) => {
  try {
    console.log("i am fetching this", ministry_id);
    console.log("i am at this page", page);
    const inquery = {};
    const query = {};
    const select = "*,announcement(*, users(first_name,last_name))";
    const filters = {};

    // Check if ministry_id is an array
    if (Array.isArray(ministry_id)) {
      inquery.ministry_id = ministry_id;
      filters.eq = { column: "visibility", value: "public" };
    } else {
      query.ministry_id = ministry_id;
    }

    const order = [
      {
        column: "created_at",
        ascending: false,
      },
    ];

    // Fetch and paginate the public announcements when ministry_id is an array
    let publicData = [];
    let publicPagination = { totalItems: 0, totalPages: 0, currentPage: 1 };

    if (Array.isArray(ministry_id)) {
      // Paginate the public announcements 
      publicPagination = await paginate({
        key: "announcement",
        page,
        pageSize,
        query: { visibility: "public" },
        order,
        select: "*, users(first_name,last_name)",
      });

      publicData = publicPagination.items || [];
    }

    // Paginate announcement_ministries 
    const paginatedData = await paginate({
      key: "announcement_ministries",
      page,
      pageSize,
      query,
      order,
      select,
      inquery,
      filters: {},
    });

    const paginatedDataItems = paginatedData.items.map(
      (item) => item.announcement
    );

    // Merge both paginated results (public + ministry-specific announcements)
    const allAnnouncements = [...publicData, ...paginatedDataItems];

    // Remove duplicates based on announcement ID
    const uniqueAnnouncements = allAnnouncements.reduce((acc, obj) => {
      if (!acc.some((existingObj) => existingObj.id === obj.id)) {
        acc.push(obj);
      }
      return acc;
    }, []);

 
    //sort by date
    const sortedDates = uniqueAnnouncements.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    paginatedData.items = sortedDates;

  //get files associated
    const announcementsWithURL = await Promise.all(
      paginatedData.items.map(async (item) => {
        const { data: urlData, error: urlError } = await supabase.storage
          .from("Uroboros")
          .getPublicUrl(item.file_path);

        if (urlError) {
          throw new Error(`Error retrieving public URL: ${urlError.message}`);
        }

        return { ...item, file_url: urlData.publicUrl };
      })
    );

    // Return the merged data with file URLs and pagination details
    return {
      items: announcementsWithURL,
      pageSize: paginatedData.pageSize || publicPagination.pageSize,
      nextPage: paginatedData.nextPage || publicPagination.nextPage,
      totalItems: publicPagination.totalItems + paginatedData.totalItems,
      totalPages: Math.ceil(
        (publicPagination.totalItems + paginatedData.totalItems) / pageSize
      ),
      currentPage: paginatedData.currentPage || publicPagination.currentPage,
    };
  } catch (error) {
    console.error("Error fetching announcements:", error.message);
    throw new Error(
      error.message ||
        "An unexpected error occurred while fetching announcements."
    );
  }
};

/**
 * Edits an existing announcement. Optionally uploads a new file, deletes the old file, and updates ministry associations.
 * If the visibility is set to "public," it deletes previous ministry associations.
 *
 *
 * @param {Object} announcementData - the data for editting announcement
 * @param {string} announcementData.announcement_id - The ID of the announcement to edit.
 * @param {string} announcementData.title - The updated title of the announcement.
 * @param {string} announcementData.content - The updated content of the announcement.
 * @param {string} announcementData.visibility - The updated visibility of the announcement (e.g., 'public').
 * @param {File} [announcementData.file] - The new file to be uploaded (optional).
 * @param {string} [announcementData.filePath] - The file path of the existing file to be deleted (optional).
 * @param {string[]} announcementData.ministry - The updated list of ministry IDs to associate with the announcement.
 *
 * @throws {Error} If there is an error during the file upload, announcement update, or ministry association update.
 */
export const editAnnouncement = async (announcementData) => {
  let filepath = "";
  let fileName = "";
  let update = {
    title: announcementData.title,
    content: announcementData.content,
    visibility: announcementData.visibility,
    ministry_id: null,
  };

  // Check if the new file is provided and delete the old file if it exists
  if (announcementData.file) {
    const { error: deleteError } = await supabase.storage
      .from("Uroboros")
      .remove([announcementData.filePath]);

    if (deleteError) {
      throw new Error(`Error deleting file: ${deleteError.message}`);
    }

    // Generate a new file name and upload the new file
    const fileNameWithoutExt = announcementData.file.name.split(".")[0];
    const fileExt = announcementData.file.name.split(".")[1];
    fileName = `${fileNameWithoutExt}${Date.now()}.${fileExt}`;
    const bucketName = "Uroboros";

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(`announcement/${fileName}`, announcementData.file);

    if (uploadError) {
      throw new Error(`Error uploading file: ${uploadError.message}`);
    }

    filepath = uploadData.path;
    update = {
      ...update,
      file_name: fileName,
      file_type: announcementData.file.type,
      file_path: filepath,
    };
  }

  // If ministry Id is availbale delete previous connections and create new connections using the ministry Ids
  if (announcementData.ministry.length > 0) {
    const { error: deleteError } = await supabase
      .from("announcement_ministries")
      .delete()
      .eq("announcement_id", announcementData.announcement_id);

    if (deleteError) {
      throw new Error(deleteError.message);
    }
    const insertPromises = announcementData.ministry.map(async (ministry) => {
      const { error } = await supabase.from("announcement_ministries").insert([
        {
          announcement_id: announcementData.announcement_id,
          ministry_id: ministry,
        },
      ]);

      if (error) {
        throw new Error(error.message);
      }
    });
    await Promise.all(insertPromises);
  }
  // If visibility is public delete connection of the announcement
  if (announcementData.visibility === "public") {
    const { error } = await supabase
      .from("announcement_ministries")
      .delete()
      .eq("announcement_id", announcementData.announcement_id);

    if (error) {
      throw new Error(error.message);
    }
  }
  const { error } = await supabase
    .from("announcement")
    .update(update)
    .eq("id", announcementData.announcement_id);

  if (error) {
    throw new Error(error.message);
  }
};
/**
 * Deletes an announcement and its associated file (if a file path is provided).
 * Checks if the announcement exists before deleting it.
 *
 *  @param {Object} params - The parameters for deleting an announcement.
 * @param {String} params.annnouncement_id - Id of the announcement to be deleted
 * @param {String} params.filepath - file path of the announcement file to be deleted
 */

export const deleteAnnouncement = async ({ announcement_id, filePath }) => {
  if (!announcement_id) {
    throw new Error("Announcement ID is missing");
  }

  // Check if the announcement_id exists before attempting the delete operation
  const { data, error: existenceError } = await supabase
    .from("announcement")
    .select("id")
    .eq("id", announcement_id)
    .single();

  if (existenceError) {
    throw new Error(
      `Error Finding existing announcement: ${existenceError.message}`
    );
  }

  // Proceed with file deletion only if filePath is provided
  if (filePath) {
    const { error: storageError } = await supabase.storage
      .from("Uroboros")
      .remove([filePath]);

    if (storageError) {
      throw new Error(`Error deleting file: ${storageError.message}`);
    }
  }

  const { error: deleteError } = await supabase
    .from("announcement")
    .delete()
    .eq("id", data.id);

  if (deleteError) {
    throw new Error(deleteError.message);
  }
};

/**
 * Fetches the ministry IDs associated with a specific announcement.
 * @param {String} announcement_id - announcement ID to fetch all ministry ID it belongs to
 * @returns {Promise<string[]>} - A list of ministry IDs associated with the announcement.
 * @throws {Error} If there is an error while fetching the associated ministries.
 */

export const getAnnouncementMinistryId = async (announcement_id) => {
  const { data, error } = await supabase
    .from("announcement_ministries")
    .select("ministry_id")
    .eq("announcement_id", announcement_id);

  const ministryIds = data.map((ministry) => ministry.ministry_id);
  if (error) {
    throw new Error(error.message);
  }
  return ministryIds;
};

// export const trygettingallinone = async (ministry_ids) => {
//   const { data, error } = await supabase
//     .from("announcement_ministries")
//     .select("*, announcement(*)").in("ministry_id",ministry_ids)
//     .eq("announcement.visibility", "public");

//   if (error) {
//     throw new Error("Error fetching", error.message);
//   }

//   return data;
// };
