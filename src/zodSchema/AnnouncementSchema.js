import z from "zod";

// Define maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "video/mp4",
  "video/avi",
  "video/quicktime", // mov
  "application/pdf",
  "application/vnd.ms-powerpoint", // ppt
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
  "application/msword", // doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
];

const AnnouncementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),

  files: z
    .array(z.instanceof(File))
    .max(5, "Maximum of 5 files allowed")
    .default([])
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      `Each file must not exceed 5MB`
    )
    .refine(
      (files) => files.every((file) => allowedMimeTypes.includes(file.type)),
      "Invalid file type. Allowed: jpg, jpeg, png, gif, mp4, avi, mov, pdf, ppt, pptx, doc, docx."
    ),
});

export { AnnouncementSchema };
