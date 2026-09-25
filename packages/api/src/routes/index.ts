import express, { Router } from 'express';
import * as authController from '../controllers/authController.js';
import * as courseController from '../controllers/courseController.js';
import * as forumController from '../controllers/forumController.js';
import * as resourceController from '../controllers/resourceController.js';
import * as assignmentController from '../controllers/assignmentController.js';
import * as externalController from '../controllers/externalController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth } from '../middleware/session.js';

export const router: express.Router = Router();

router.get('/me', authController.me);
router.post('/login', asyncHandler(authController.login));
router.post('/logout', authController.logout);

router.get('/youtube/transcript', asyncHandler(externalController.youtubeTranscript));
router.get('/google-sheet', asyncHandler(externalController.googleSheet));

router.get('/courses', requireAuth, asyncHandler(courseController.listCourses));
router.get('/course/:id', requireAuth, asyncHandler(courseController.getCourseContent));

router.get('/forum/:id', requireAuth, asyncHandler(forumController.getForumDiscussions));
router.get('/forum/discussion/:id', requireAuth, asyncHandler(forumController.getForumDiscussion));

router.get('/resource/:id', requireAuth, asyncHandler(resourceController.resolveResource));
router.get('/resource/:id/text', requireAuth, asyncHandler(resourceController.getResourceText));
router.get('/resource/:id/download', requireAuth, asyncHandler(resourceController.downloadResource));

router.get('/assignment/:id', requireAuth, asyncHandler(assignmentController.getAssignmentInfo));
