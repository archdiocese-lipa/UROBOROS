import * as z from "zod";

const loginSchema = z.object({
    email: z.string().email("Email must be valid"),
    password: z.string().min(6, "Password must be 6 characters.")
})

export {
    loginSchema
}