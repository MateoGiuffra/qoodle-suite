// Punto de entrada del SDK: lo que un proyecto externo instala y usa.
// server.ts y mcp/mcpServer.ts son las "apps" de este repo y no se exportan acá.

export { QoodleClient } from './qoodle/QoodleClient.js';
export { QoodleSession } from './qoodle/QoodleSession.js';
export { StaticSession } from './qoodle/StaticSession.js';
export type { QoodleAuth } from './qoodle/QoodleAuth.js';
export { createHttpClient } from './qoodle/httpClient.js';
export { performSamlLogin } from './qoodle/samlAuth.js';

export type { CourseClassification, CourseSummary } from './qoodle/courseListService.js';
export type { ResolvedResource, DownloadedResource } from './qoodle/resourceService.js';
export type { ResourceText } from './qoodle/resourceTextService.js';

export { parseCourse } from './parsers/courseParser.js';
export type { CourseContent, Section, Activity } from './parsers/courseParser.js';
export { parseForumView, parseDiscussion } from './parsers/forumParser.js';
export type { DiscussionListItem, ForumDiscussionList, ForumPost, DiscussionContent } from './parsers/forumParser.js';
export { parseAssignmentView } from './parsers/assignmentParser.js';
export type { AssignmentFile, AssignmentInfo } from './parsers/assignmentParser.js';

export { getYoutubeTranscript } from './external/YoutubeTranscriptService.js';
export type { TranscriptResult } from './external/YoutubeTranscriptService.js';
export { getPublicSheetCsv } from './external/GoogleSheetService.js';
export type { SheetResult } from './external/GoogleSheetService.js';

export { AppError, ValidationError, UnauthorizedError, NotFoundError, UpstreamError, isAppError } from './errors/AppError.js';

export { moodleIdSchema, courseClassificationSchema, youtubeVideoSchema, googleSheetSchema } from './validation/schemas.js';
