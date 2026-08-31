import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/content.js';

const passwordRule = z.string().min(8, 'Use at least 8 characters.').max(200);
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8).max(200) });
const setupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.').max(80),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.').max(200),
});
const imageData = z.string().max(700_000, 'Profile image is too large.').regex(/^data:image\/(png|jpeg|webp);base64,/).or(z.literal(''));
const credentialsSchema = z.object({
  currentPassword: z.string().min(8).max(200),
  name: z.string().min(2).max(80).optional(),
  imageUrl: imageData.optional(),
  email: z.string().email().optional(),
  newPassword: passwordRule.optional(),
}).refine((value) => value.name || value.imageUrl !== undefined || value.email || value.newPassword, 'Provide at least one change.');

export async function setupStatus(req, res, next) {
  try {
    const count = await User.countDocuments();
    res.json({ success: true, data: { needsSetup: count === 0 } });
  } catch (error) {
    next(error);
  }
}

export async function registerFirstUser(req, res, next) {
  try {
    const count = await User.countDocuments();
    if (count > 0) {
      return res.status(403).json({
        success: false,
        message: 'Registration is closed. An administrator account already exists.',
      });
    }

    const { name, email, password } = setupSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: 'admin',
    });

    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    });

    res.status(201).json({
      success: true,
      message: 'First administrator account created successfully.',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          imageUrl: user.imageUrl,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    });
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          imageUrl: user.imageUrl,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export function profile(req, res) {
  res.json({
    success: true,
    data: {
      id: req.user.id,
      name: req.user.name,
      imageUrl: req.user.imageUrl,
      email: req.user.email,
      role: req.user.role,
    },
  });
}

export async function updateCredentials(req, res, next) {
  try {
    const { currentPassword, name, imageUrl, email, newPassword } = credentialsSchema.parse(req.body);
    const user = await User.findById(req.user.id).select('+passwordHash');
    if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
      return res.status(401).json({ success: false, message: 'Your current password is incorrect.' });
    }
    if (name) user.name = name;
    if (imageUrl !== undefined) user.imageUrl = imageUrl;
    if (email && email.toLowerCase() !== user.email) {
      const existing = await User.exists({ email: email.toLowerCase(), _id: { $ne: user.id } });
      if (existing) return res.status(409).json({ success: false, message: 'That email address is already in use.' });
      user.email = email.toLowerCase();
    }
    if (newPassword) user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        imageUrl: user.imageUrl,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

