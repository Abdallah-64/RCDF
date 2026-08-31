import { Router } from 'express';
import { login, profile, registerFirstUser, setupStatus, updateCredentials } from '../controllers/authController.js';
import * as c from '../controllers/contentController.js';
import { adminOnly, optionalAuth, protect } from '../middleware/auth.js';

const admin = [protect, adminOnly];
const router = Router();

router.get('/auth/setup-status', setupStatus);
router.post('/auth/setup', registerFirstUser);
router.post('/auth/login', login);
router.get('/auth/profile', ...admin, profile);
router.patch('/auth/credentials', ...admin, updateCredentials);
for (const [path, controller] of [['services', c.services], ['projects', c.projects]]) { router.get(`/${path}`, optionalAuth, controller.list); router.get(`/${path}/:id`, optionalAuth, controller.get); router.post(`/${path}`, ...admin, controller.create); router.put(`/${path}/:id`, ...admin, controller.update); router.delete(`/${path}/:id`, ...admin, controller.remove); }
router.get('/statistics', c.statistics); router.put('/statistics', ...admin, c.saveStatistics); router.get('/pages/:key', c.getPage); router.put('/pages/:key', ...admin, c.savePage); router.get('/settings', c.getSettings); router.put('/settings', ...admin, c.saveSettings); router.post('/contact', c.submitContact); router.get('/contact', ...admin, c.messages); router.patch('/contact/:id/read', ...admin, c.markMessage); router.delete('/contact/:id', ...admin, c.deleteMessage); router.get('/dashboard', ...admin, c.dashboard);
export default router;
