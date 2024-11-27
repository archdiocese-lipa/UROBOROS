import { supabase } from "./supabaseClient";

export const createAnnouncements = async ({ announcementData, user_id }) => {


  
    let filepath = "";
    let fileName = "";
    if (announcementData.file) {
      const fileNameWihoutExt = announcementData.file.name.split(".")[0];
      const fileExt = announcementData.file.name.split(".")[1];
      fileName = `${fileNameWihoutExt}${Date.now()}.${fileExt}`;
      const bucketName = "Uroboros";

      // Upload the file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(`announcement/${fileName}`, announcementData.file);

      // Handle upload error
      if (uploadError) {
        throw new Error(`Error uploading file: ${uploadError.message}`);
      }

      filepath = uploadData.path;
    }

    // Insert the announcement recpord into the database
    if (announcementData.ministry.length > 0) {
  
      const insertPromises = announcementData.ministry.map(async (ministry) => {
        const { error } = await supabase.from("announcement").insert([
          {
            title: announcementData.title,
            content: announcementData.content,
            visibility: announcementData.visibility,
            user_id,
            file_name: fileName,
            file_type: announcementData.file.type,
            file_path: filepath,
            ministry_id: ministry,
          },
        ]);
        // Handle insert error
        if (error) {
          throw error;
        }
      });
      await Promise.all(insertPromises);
    } else {
   
      const { error } = await supabase.from("announcement").insert([
        {
          title: announcementData.title,
          content: announcementData.content,
          visibility: announcementData.visibility,
          user_id,
          file_name: fileName,
          file_type: announcementData.file.type,
          file_path: filepath,
        },
      ]);
      if (error) {
        throw error;
      }
    }
};

export const fetchAnnouncements = async (ministry) => {
  try {
    let query = supabase
      .from("announcement")
      .select("*, users(first_name, last_name)")
      .order("created_at", { ascending: false });

    //   query = query.eq("visibility", visibility);

    if (ministry !== "") {
      query = query.eq("ministry_id", ministry);
    } else {
      query = query.eq("visibility", "public");
    }
    //   } else {
    //     // If ministry is null, we want to fetch announcements with public visibility
    //     query = query.eq("visibility", "public");
    //   }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message || "Error fetching announcements");
    }

    // Fetch file URLs and map them to the announcements
    const announcementsWithURL = await Promise.all(
      data.map(async (item) => {
        const { data: urlData, error: urlError } = supabase.storage
          .from("Uroboros")
          .getPublicUrl(item.file_path);

        // Handle URL retrieval error
        if (urlError) {
          throw new Error(`Error retrieving public URL: ${urlError.message}`);
        }

        return { ...item, file_url: urlData.publicUrl };
      })
    );

    return announcementsWithURL;
  } catch (error) {
    console.error("Error fetching announcements:", error);
    throw new Error(
      error.message ||
        "An unexpected error occurred while fetching announcements."
    );
  }
};

export const editAnnouncement = async (announcementData) => {

    let filepath = "";
    let fileName = "";
    let update = {
      title: announcementData.title,
      content: announcementData.content,
      visibility: announcementData.visibility,
    };

    // Check if the new file is provided and delete the old file if it exists
    if (announcementData.file) {
      // Delete old file if there is one
      const { error: deleteError } = await supabase.storage
        .from("Uroboros")
        .remove([announcementData.filePath]);

      // Handle file deletion errors
      if (deleteError) {
        throw new Error(`Error deleting file: ${deleteError.message}`);
      }

      // Generate a new file name and upload the new file
      const fileNameWithoutExt = announcementData.file.name.split(".")[0];
      const fileExt = announcementData.file.name.split(".")[1];
      fileName = `${fileNameWithoutExt}${Date.now()}.${fileExt}`;
      const bucketName = "Uroboros";

      // Upload the new file
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
        file_type: announcementData.file_type,
        file_path: filepath,
      };
    }

    if (announcementData.ministry.length > 0) {


      const insertPromises = announcementData.ministry.map(async (ministry) => {
        const { error } = await supabase.from("announcement").upsert([
          {
            title: announcementData.title,
            content: announcementData.content,
            visibility: announcementData.visibility,
            user_id: announcementData.user_id,
            file_name: fileName,
            file_type: announcementData.file ? announcementData.file.type : "",
            file_path: filepath,
            ministry_id: ministry,
          },
        ]);
        // Handle insert error
        if (error) {
            throw new Error(error.message);
        }
        
      });
      await Promise.all(insertPromises);
      //update first before deleting
      const { error:deleteError } = await supabase
      .from("announcement")
      .delete()
      .eq("id", announcementData.announcement_id);

    if (deleteError) {
      throw new Error(deleteError.message);
    }
    } else {
      const { error } = await supabase
        .from("announcement")
        .update(update)
        .eq("id", announcementData.announcement_id);

      if (error) {
        throw new Error(error.message);
      }
   
    }

    // Update the announcement data in the database
};

export const deleteAnnouncement = async ({ announcement_id, filePath }) => {

    // Check if the `announcement_id` exists before attempting the delete operation
    if (!announcement_id) {
      throw new Error("Announcement ID is missing");
    }


    const { error: storageError } = await supabase.storage
      .from("Uroboros")
      .remove([filePath]);

    // Handle any errors during deletion
    if (storageError) {
      throw new Error(`Error deleting file: ${storageError.message}`);
    }

    // Perform your delete operation (e.g., supabase deletion)
    const { error } = await supabase
      .from("announcement")
      .delete()
      .eq("id", announcement_id);

    if (error) {
      throw new Error(error.message);
    }
};
