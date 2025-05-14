export const API_PATHS = {
    AUTH: {
      LOGIN:    '/auth/login',
      LOGOUT:   '/auth/logout',
      REGISTER: '/auth/register',
      REFRESH : '/auth/refresh',
      ME: '/auth/me',
      PASSWORD: '/auth/password'
    },

    ADMIN : {
      ALL_USERS: '/admin/users',
      ADD_USERS : '/admin/users',
      ALL_STUDENT_USER: '/admin/users/student',
      ALL_FACULTY_USER: '/admin/users/faculty',
      ALL_ADMIN_USER: '/admin/users/admin',
      ALL_COURSES: '/admin/courses',
      ALL_COURSE: (courseId) => `/admin/courses/${courseId}`,
    },

    COURSE : {
      ALL_COURSES: '/admin/courses',
      GET_COURSE_BY_ID: (courseId) => `/admin/courses/${courseId}`,
      ALL_ACTIVE_COURSES : '/admin/courses/active',
      ALL_PENDING_COURSES : '/admin/courses/pending',
      ALL_INACTIVE_COURSES : '/admin/courses/inactive',
      COURSE: (courseId) => `/admin/courses/${courseId}`,
      ALL_FACULTY: (courseId) => `/admin/courses/${courseId}/faculty`,
      ALL_STUDENTS: (courseId) => `/admin/courses/${courseId}/students`,
      UPDATE_STATUS : (courseId) =>  `/admin/courses/${courseId}/status`,
      QUIZZES: (courseId) => `/admin/courses/${courseId}/quizzes`,

    },

    FACULTY : {
      ALL_COURSES: (facultyId) => `/admin/courses/faculty/${facultyId}`,
      ALL_STUDENTS: (courseId) => `/admin/courses/${courseId}/students`,
      ASSIGN_FACULTY: (courseId) => `/admin/courses/${courseId}/faculty`,
    },

    STUDENT : {
      ALL_COURSES: '/admin/courses',
      ASSIGN_STUDENT : (courseId) => `/admin/courses/${courseId}/students`,
      ALL_QUIZZES: (courseId) => `/admin/courses/${courseId}/quizzes`,
      QUIZ: (quizId) => `/admin/quizzes/${quizId}`,
      QUIZ_SUBMIT: (quizId) => `/admin/quizzes/${quizId}/submit`,
    },

    QUIZ: {
      ALL_QUIZZES: '/admin/quizzes',
      QUIZ: (quizId) => `/admin/quizzes/${quizId}`,
      QUIZ_SUBMIT: (quizId) => `/admin/quizzes/${quizId}/submit`,
    },

    METRICS: {
      DASHBOARD_STATS: '/admin/dashboard/stats',
      DASHBOARD_RECENT_ACTIVITIES: '/admin/dashboard/recent-activities',
      DASHBOARD_TRENDING:         '/admin/dashboard/trending-courses',
      DASHBOARD_ENROLLMENT:       '/admin/dashboard/enrollment-trend',   // NEW
      DASHBOARD_QUIZ_PERF:        '/admin/dashboard/quiz-performance',   // NEW
    },

    SETTINGS: {
      ALL_SETTINGS: '/admin/settings',
      UPDATE_SETTINGS: '/admin/settings',
    },

};
  

export const API_PATHS_FACULTY = {
  // Faculty Dashboard
  DASHBOARD: '/faculty/dashboard',

  // Course Management
  CREATE_COURSE: '/faculty/courses',
  ALL_COURSES:   '/faculty/courses',
  GET_COURSE_BY_ID: (courseId) => `/faculty/courses/${courseId}`,
  UPDATE_COURSE:    (courseId) => `/faculty/courses/${courseId}`,
  DELETE_COURSE:    (courseId) => `/faculty/courses/${courseId}`,

  // Module Management
  CREATE_MODULE: '/faculty/courses/modules',
  LIST_MODULES:  (courseId) => `/faculty/courses/${courseId}/modules`,
  UPDATE_MODULE: (moduleId) => `/faculty/modules/${moduleId}`,
  DELETE_MODULE: (moduleId) => `/faculty/modules/${moduleId}`,

  // Content Management (under modules)
  ADD_CONTENT:    '/faculty/modules/content',
  LIST_CONTENT:   (moduleId) => `/faculty/modules/${moduleId}/content`,
  GET_CONTENT:    (moduleId, contentId) => `/faculty/modules/${moduleId}/content/${contentId}`,
  UPDATE_CONTENT: (moduleId, contentId) => `/faculty/modules/${moduleId}/content/${contentId}`,
  DELETE_CONTENT: (moduleId, contentId) => `/faculty/modules/${moduleId}/content/${contentId}`,

  // Quiz Management (under modules)
  CREATE_QUIZ:    (moduleId) => `/faculty/modules/${moduleId}/quizzes`,
  GET_QUIZZES:    (moduleId) => `/faculty/modules/${moduleId}/quizzes`,
  GET_QUIZ_BY_ID: (moduleId, quizId) => `/faculty/modules/${moduleId}/quizzes/${quizId}`,
  UPDATE_QUIZ:    (moduleId, quizId) => `/faculty/modules/${moduleId}/quizzes/${quizId}`,
  DELETE_QUIZ:    (moduleId, quizId) => `/faculty/modules/${moduleId}/quizzes/${quizId}`,

  // Delete a single quiz question
  DELETE_QUIZ_QUESTION: (courseId, quizQuestionId) =>
    `/faculty/courses/${courseId}/quizQuestion/${quizQuestionId}`,

  // File Upload & Management (under courses)
  UPLOAD_FILES: '/faculty/courses/files',  
  LIST_FILES:   (courseId) => `/faculty/courses/${courseId}/files`,
  DELETE_FILE:  (courseId, fileId) =>
    `/faculty/courses/${courseId}/files/${fileId}`,

  // (optional) Notifications
  // ALL_NOTIFICATIONS:      '/faculty/notifications',
  // MARK_NOTIFICATION_READ: (notificationId) => `/faculty/notifications/${notificationId}/read`,
};
