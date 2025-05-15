import { paginate } from "@/lib/utils";
import { supabase } from "./supabaseClient";
import axios from "axios";
import { getAuthToken } from "./feedBackService";

export const createAnnouncement = async ({
  data,
  groupId = null,
  subGroupId = null,
}) => {
  try {
    const token = await getAuthToken();
    // Create a FormData instance for multipart/form-data submission
    const formData = new FormData();

    // Add text fields
    formData.append("title", data.title);
    formData.append("content", data.content);

    // Add optional fields if they exist
    if (groupId) formData.append("groupId", groupId);
    if (subGroupId) formData.append("subGroupId", subGroupId);

    // Add files if they exist
    if (data.files && data.files.length > 0) {
      Array.from(data.files).forEach((file) => {
        formData.append("files", file);
      });
    }

    // Make API request with the formData
    const response = await axios.post(
      `${import.meta.env.VITE_UROBOROS_API_PRODUCTION}/announcement/create`,
      // "http://localhost:3000/announcement/create",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating announcement:", error.message);

    // Return a more helpful error message
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      throw new Error(
        error.response.data.error || "Failed to create announcement"
      );
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("No response from server. Please check your connection.");
    } else {
      // Something happened in setting up the request
      throw new Error("Error setting up request: ", error.message);
    }
  }
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
 *
 *
 */

export const fetchAnnouncementsV2 = async (
  page,
  pageSize,
  groupId,
  subgroupId
) => {
  try {
    const select =
      "*, users(first_name,last_name,role), announcement_files(url,name,type)";
    const order = [{ column: "created_at", ascending: false }];

    const query = {};

    if (subgroupId) {
      query.subgroup_id = subgroupId;
    } else if (groupId) {
      query.group_id = groupId;
    } else {
      query.visibility = "public";
    }

    const paginatedData = await paginate({
      key: "announcement",
      page,
      pageSize,
      query,
      order,
      select,
      filters: {},
    });

    paginatedData.items = paginatedData.items.map((item) => ({
      ...item,
      announcement_files: item.announcement_files.map((file) => ({
        ...file,
        url: supabase.storage.from("Uroboros").getPublicUrl(file.url).data
          .publicUrl,
      })),
    }));

    return paginatedData;
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
export const editAnnouncement = async ({ data, announcementId }) => {
  const { data: existingFiles, error } = await supabase
    .from("announcement_files")
    .select("id,name,url")
    .eq("announcement_id", announcementId);

  if (error) {
    throw new Error("Error checking existing files.");
  }

  // Delete files that are not in the new data.files array
  const filesToDelete = existingFiles.filter(
    (existingFile) =>
      !data.files.some((file) => file.name === existingFile.name)
  );

  if (filesToDelete.length > 0) {
    const fileIdsToDelete = filesToDelete.map((file) => file.id);
    const filePathToDelete = filesToDelete.map((file) => file.url);

    const { error: storageError } = await supabase.storage
      .from("Uroboros")
      .remove(filePathToDelete);

    if (storageError) {
      console.error(
        `Error deleting file from storage: ${filesToDelete[0].url}`,
        storageError
      );
    }

    const { error: deleteError } = await supabase
      .from("announcement_files")
      .delete()
      .in("id", fileIdsToDelete);

    if (deleteError) {
      throw new Error(`Error deleting files: ${deleteError.message}`);
    }
  }

  // Upload new or updated files using their original name
  const fileData = await Promise.all(
    data.files.map(async (file) => {
      const fileName = file.name;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("Uroboros")
        .upload(`announcement/${fileName}`, file, { upsert: true });

      if (uploadError) {
        throw new Error(`Error uploading file: ${uploadError.message}`);
      }

      return {
        url: uploadData.path,
        name: fileName,
        type: file.type,
      };
    })
  );

  // Update announcement details
  const { error: updateError } = await supabase
    .from("announcement")
    .update({
      title: data.title,
      content: data.content,
    })
    .eq("id", announcementId);

  if (updateError) {
    throw new Error("Error updating announcement.");
  }

  // Upsert file data with conflict resolution on announcement_id and name
  await Promise.all(
    fileData.map(async (file) => {
      // Check if the file already exists
      const { data: existingFile, error: selectError } = await supabase
        .from("announcement_files")
        .select("id")
        .eq("announcement_id", announcementId)
        .eq("name", file.name)
        .single(); // Get a single record

      if (selectError && selectError.code !== "PGRST116") {
        console.error("Error checking existing file:", selectError);
        throw selectError;
      }

      // If file does NOT exist, insert it
      if (!existingFile) {
        const { error: insertError } = await supabase
          .from("announcement_files")
          .insert([{ announcement_id: announcementId, ...file }]);

        if (insertError) {
          // Check if the error is a unique constraint violation
          if (insertError.code === "23505") {
            throw new Error("Cannot upload the same image.");
          }
          console.error(
            "Error inserting into announcement_files:",
            insertError
          );
          throw insertError;
        }
      }
    })
  );
};

/**
 * Deletes an announcement and its associated file (if a file path is provided).
 * Checks if the announcement exists before deleting it.
 *
 *  @param {Object} params - The parameters for deleting an announcement.
 * @param {String} params.annnouncement_id - Id of the announcement to be deleted
 * @param {String} params.filepath - file path of the announcement file to be deleted
 */
export const deleteAnnouncement = async ({ announcement_id, filePaths }) => {
  const urls = filePaths.map((publicUrl) => {
    try {
      const decodedUrl = decodeURIComponent(publicUrl); // Decode spaces and special characters
      const urlParts = new URL(decodedUrl);
      const path = urlParts.pathname.split(
        "/storage/v1/object/public/Uroboros/"
      )[1];

      if (!path) {
        throw new Error("Invalid file path extracted.");
      }
      const decodedPath = decodeURIComponent(path);

      return decodedPath;
    } catch (error) {
      console.error("Error extracting path from URL:", error.message);
      throw error;
    }
  });

  if (!announcement_id) {
    throw new Error("Announcement ID is missing");
  }

  // Check if announcement exists before deletion
  const { data, error: existenceError } = await supabase
    .from("announcement")
    .select("id")
    .eq("id", announcement_id)
    .single();

  if (existenceError) {
    throw new Error(
      `Error finding existing announcement: ${existenceError.message}`
    );
  }

  // Proceed with file deletion only if urls are valid
  if (urls.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("Uroboros")
      .remove(urls); // Remove files correctly

    if (storageError) {
      throw new Error(`Error deleting file: ${storageError.message}`);
    }
  }

  // Delete the announcement from the database
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

export const fetchSingleAnnouncement = async (announcementId) => {
  try {
    if (!announcementId) {
      throw new Error(
        "Announcement ID is required to fetch a single announcement."
      );
    }

    const { data: announcement, error } = await supabase
      .from("announcement")
      .select(
        "*, users(first_name, last_name, role), announcement_files(id, url, name, type)"
      )
      .eq("id", announcementId)
      .single(); // Use single() as we expect one announcement

    if (error) {
      if (error.code === "PGRST116") {
        // PostgREST error for "No rows found"
        return null; // Or throw new Error("Announcement not found");
      }
      console.error("Error fetching single announcement:", error.message);
      throw error;
    }

    if (!announcement) {
      return null; // Announcement not found
    }

    // Transform file URLs to public URLs
    const transformedAnnouncement = {
      ...announcement,
      announcement_files: announcement.announcement_files.map((file) => ({
        ...file,
        url: supabase.storage.from("Uroboros").getPublicUrl(file.url).data
          .publicUrl,
      })),
    };

    return transformedAnnouncement;
  } catch (err) {
    console.error("Error in fetchSingleAnnouncement:", err.message);
    throw new Error(
      err.message ||
        "An unexpected error occurred while fetching the announcement."
    );
  }
};

export const getAnnouncementByComment = async (commentId) => {
  const { data, error } = await supabase
    .from("comment_data")
    .select(
      "announcement(id, title, content, created_at, visibility, users(first_name, last_name, role), announcement_files(id, url, name, type))"
    )
    .eq("id", commentId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Transform file URLs to public URLs
  data.announcement.announcement_files =
    data.announcement.announcement_files.map((file) => ({
      ...file,
      url: supabase.storage.from("Uroboros").getPublicUrl(file.url).data
        .publicUrl,
    }));

  return data;
};
