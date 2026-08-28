import { z } from 'zod';
export const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid record identifier');
const serviceImage = z.string().url().or(z.string().regex(/^data:image\/(png|jpeg|webp);base64,/, 'Use a PNG, JPEG, or WebP image.')).or(z.literal(''));
export const serviceSchema = z.object({ title: z.string().min(2).max(120), slug: z.string().min(2).max(140).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(), shortDescription: z.string().min(10).max(280), description: z.string().min(20).max(10000), imageUrl: serviceImage, status: z.enum(['draft', 'published']) });
export const projectSchema = z.object({ title: z.string().min(2).max(120), slug: z.string().min(2).max(140).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), description: z.string().min(20).max(10000), imageUrl: z.string().url().or(z.literal('')), location: z.string().min(2).max(160), date: z.coerce.date(), status: z.enum(['draft', 'published']) });
export const contactSchema = z.object({ name: z.string().min(2).max(100), email: z.string().email(), phone: z.string().max(40).optional().or(z.literal('')), subject: z.string().min(3).max(160), message: z.string().min(10).max(5000) });
