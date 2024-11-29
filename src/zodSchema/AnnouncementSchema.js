import z from "zod";

// Define maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5MB in bytes

const checkFileType = (file) => {
  if (file?.name) {
    const fileType = file.name.split(".").pop().toLowerCase();
    const allowedTypes = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "mp4",
      "avi",
      "mov",
      "pdf",
      "ppt",
      "pptx",
      "doc",
      "docx",
    ];

    return allowedTypes.includes(fileType);
  }
  return false;
}

const AnnouncementSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
  
    file: z
      .any()
      .optional()
      .refine(
        (file) => !file || file instanceof File, // Ensure it is a valid File if provided
        "File must be of type File"
      )
      .refine(
        (file) => !file || file.size <= MAX_FILE_SIZE, // Skip size check if no file
        `Max file size is 5MB.`
      )
      .refine(
        (file) => !file || checkFileType(file), // Skip type check if no file
        "Invalid file type. Allowed types are .jpg, .jpeg, .png, .gif, .mp4, .avi, .mov, .pdf, .ppt, .pptx, .doc, .docx."
      ),
  
    ministry: z.array(z.string()).min(0, "Ministry must be an array"),
  
    visibility: z.string().min(1, "Visibility is required"),
  })
  .refine(
    (data) => {
      // If visibility is "private", make sure ministry has at least one value
      return data.visibility === "public" || (data.visibility === "private" && data.ministry.length > 0);
    }, 
    { message: "Ministry is required when visibility is private", path: ["ministry"] }
  );
  

export { AnnouncementSchema };
