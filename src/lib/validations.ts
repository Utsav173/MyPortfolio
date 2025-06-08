import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(100, { message: 'Name cannot exceed 100 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }).trim().toLowerCase(),
  message: z
    .string()
    .trim()
    .min(10, { message: 'Message must be at least 10 characters.' })
    .max(1000, { message: 'Message cannot exceed 1000 characters.' }),
});
