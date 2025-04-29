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
      ALL_STUDENT_USER: 'admin/users/student',
      ALL_FACULTY_USER: 'admin/users/faculty',
      ALL_ADMIN_USER: 'admin/users/admin',
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
      DASHBOARD: '/admin/metrics',
    },

    SETTINGS: {
      ALL_SETTINGS: '/admin/settings',
      UPDATE_SETTINGS: '/admin/settings',
    },

};
  