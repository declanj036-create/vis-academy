// VIS ACADEMY Branding Constants
export const BRAND = {
  name: 'VIS ACADEMY',
  fullName: 'Velocity International STEM Academy',
  founder: 'Sir Victor from Enugu, Nigeria',
  tagline: 'Learn Without Limits - From Enugu to the World',
  
  stats: {
    countries: '15+',
    students: '2000+',
    rating: '4.9',
    years: '3+',
    activeStudents: '50+'
  },
  
  colors: {
    black: '#02020a',
    gold1: '#D4AF37',
    gold2: '#FFD700',
    goldDark: '#B8860B',
    white: '#ffffff',
    grayLight: '#f5f5f5'
  },
  
  fonts: {
    heading: 'Playfair Display',
    body: 'Poppins'
  },
  
  classrooms: [
    {
      name: 'USA',
      code: 'lvrdvh7f',
      url: 'https://classroom.google.com/c/ODcxODEyOTg1MDc5?cjc=lvrdvh7f',
      flag: '🇺🇸'
    },
    {
      name: 'Nigeria',
      code: 'qobzjcr6',
      url: 'https://classroom.google.com/c/ODcxODEyODM1MTcy?cjc=qobzjcr6',
      flag: '🇳🇬'
    },
    {
      name: 'UK',
      code: 'o2k7o3l5',
      url: 'https://classroom.google.com/c/o2k7o3l5',
      flag: '🇬🇧'
    },
    {
      name: 'Canada',
      code: 'd3c4v6a7',
      url: 'https://classroom.google.com/c/d3c4v6a7',
      flag: '🇨🇦'
    },
    {
      name: 'Australia',
      code: 'p4r5t6y8',
      url: 'https://classroom.google.com/c/p4r5t6y8',
      flag: '🇦🇺'
    },
    {
      name: 'Europe',
      code: 'z9x8c7v6',
      url: 'https://classroom.google.com/c/z9x8c7v6',
      flag: '🇪🇺'
    }
  ],
  
  contact: {
    email1: 'scienceandmathsmadeeasy@gmail.com',
    email2: 'support@visacademy.com',
    phoneUSA: '+1 (402) 251-3055',
    phoneNigeria: '+234 906 312 3828',
    googleMeet: 'https://meet.google.com/fim-eeua-dor',
    whatsapp: 'https://chat.whatsapp.com/Dw3CxBWDUpZ9cxyVZkRYTI'
  },
  
  categories: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Coding', 'JAMB Math'],
  
  placeholderCourses: [
    { title: 'Physics Fundamentals', category: 'Physics', instructor: 'Sir Victor' },
    { title: 'Chemistry Mastery', category: 'Chemistry', instructor: 'Sir Victor' },
    { title: 'Biology Essentials', category: 'Biology', instructor: 'Sir Victor' },
    { title: 'Advanced Mathematics', category: 'Mathematics', instructor: 'Sir Victor' },
    { title: 'Web Development with React', category: 'Coding', instructor: 'Sir Victor' },
    { title: 'JAMB Math Preparation', category: 'JAMB Math', instructor: 'Sir Victor' },
    { title: 'Organic Chemistry Deep Dive', category: 'Chemistry', instructor: 'Sir Victor' },
    { title: 'Calculus for Beginners', category: 'Mathematics', instructor: 'Sir Victor' }
  ]
}

export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://ccmcomoyzqfsbfpvmumb.supabase.co',
  bucket: 'course-thumbnails'
}
