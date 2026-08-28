import mongoose from 'mongoose';

const image = { imageUrl: { type: String, trim: true, default: '' } };
export const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, trim: true, required: true }, imageUrl: { type: String, trim: true, default: '' }, email: { type: String, lowercase: true, trim: true, unique: true, required: true }, passwordHash: { type: String, required: true, select: false }, role: { type: String, enum: ['admin'], default: 'admin' }
}, { timestamps: true }));
export const Service = mongoose.model('Service', new mongoose.Schema({
  title: { type: String, required: true, trim: true }, slug: { type: String, required: true, unique: true, lowercase: true, trim: true }, shortDescription: { type: String, required: true }, description: { type: String, required: true }, ...image, status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true }
}, { timestamps: true }));
export const Project = mongoose.model('Project', new mongoose.Schema({
  title: { type: String, required: true, trim: true }, slug: { type: String, required: true, unique: true, lowercase: true, trim: true }, description: { type: String, required: true }, ...image, location: { type: String, required: true }, date: { type: Date, required: true }, status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true }
}, { timestamps: true }));
export const Statistic = mongoose.model('Statistic', new mongoose.Schema({ value: { type: String, required: true, trim: true }, label: { type: String, required: true, trim: true }, icon: { type: String, default: 'Heart' }, order: { type: Number, default: 0 } }, { timestamps: true }));
export const Page = mongoose.model('Page', new mongoose.Schema({ key: { type: String, unique: true, required: true }, content: { type: mongoose.Schema.Types.Mixed, required: true } }, { timestamps: true }));
export const SiteSetting = mongoose.model('SiteSetting', new mongoose.Schema({ organizationName: { type: String, default: 'RCDF' }, logoUrl: { type: String, default: '' }, email: String, phone: String, address: String, facebook: String, instagram: String, twitter: String, linkedin: String, footerText: String }, { timestamps: true }));
export const ContactMessage = mongoose.model('ContactMessage', new mongoose.Schema({ name: { type: String, required: true }, email: { type: String, required: true }, phone: String, subject: { type: String, required: true }, message: { type: String, required: true }, isRead: { type: Boolean, default: false, index: true } }, { timestamps: true }));
