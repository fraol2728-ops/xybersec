import { defineQuery } from "next-sanity";
import { groq } from "next-sanity";

export const FEATURED_COURSES_QUERY = defineQuery(`*[
  _type == "course"
  && featured == true
] | order(_createdAt desc)[0...6] {
  _id,
  title,
  slug,
  description,
  tier,
  featured,
  thumbnail {
    asset-> {
      _id,
      url
    }
  },
  "moduleCount": count(modules),
  "lessonCount": count(modules[]->lessons[])
}`);

export const ALL_COURSES_QUERY = defineQuery(`
  *[_type == "course"] | order(_createdAt asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    tier,
    featured,
    thumbnail {
      asset-> {
        _id,
        url
      }
    },
    category-> {
      _id,
      title,
      icon
    },
    "moduleCount": count(modules),
    "lessonCount": count(modules[]->lessons[]),
    "estimatedHours": round(
      count(modules[]->lessons[]) * 15 / 60
    )
  }
`);

export const COURSE_BY_ID_QUERY = defineQuery(`*[
  _type == "course"
  && _id == $id
][0] {
  _id,
  title,
  slug,
  description,
  tier,
  featured,
  thumbnail {
    asset-> {
      _id,
      url
    }
  },
  category-> {
    _id,
    title
  },
  modules[]-> {
    _id,
    title,
    description,
    lessons[]-> {
      _id,
      title,
      slug
    }
  }
}`);

export const COURSE_BY_SLUG_QUERY = defineQuery(`*[
  _type == "course"
  && slug.current == $slug
][0] {
  _id,
  title,
  slug,
  description,
  tier,
  featured,
  thumbnail {
    asset-> {
      _id,
      url
    }
  },
  category-> {
    _id,
    title
  },
  modules[]-> {
    _id,
    title,
    description,
    lessons[]-> {
      _id,
      title,
      slug
    }
  }
}`);

export const STATS_QUERY = defineQuery(`{
  "courseCount": count(*[_type == "course"]),
  "lessonCount": count(*[_type == "lesson"])
}`);

export const PROGRAMS_CAREER_PATHS_QUERY = defineQuery(`*[
  _type == "course"
  && defined(slug.current)
] | order(_createdAt desc) {
  _id,
  title,
  slug,
  description,
  tier,
  thumbnail {
    asset-> {
      _id,
      url
    }
  },
  modules[]-> {
    _id,
    title,
    description,
    "lessonsCount": count(lessons[])
  },
  "lessonCount": count(modules[]->lessons[])
}`);
export const DASHBOARD_COURSES_QUERY = defineQuery(`*[
  _type == "course"
] | order(_createdAt asc) {
  _id,
  title,
  "slug": slug.current,
  description,
  tier,
  thumbnail {
    asset-> {
      url
    }
  },
  "totalLessons": count(
    modules[]->lessons[]->_id
  ),
  "firstLessonSlug": modules[0]->lessons[0]->slug.current,
  modules[]-> {
    _id,
    title,
    isFree,
    cpCost,
    "lessonCount": count(lessons[]),
    lessons[]-> {
      _id,
      title,
      "slug": slug.current,
    }
  }
}`);


export const ALL_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    icon,
    description
  }
`);
export const COURSES_CATEGORIES_QUERY = defineQuery(`*[
  _type == "category"
] | order(title asc) {
  _id,
  title
}`);

export const COURSE_WITH_MODULES_QUERY = defineQuery(`*[
  _type == "course"
  && slug.current == $slug
][0] {
  _id,
  title,
  slug,
  description,
  tier,
  featured,
  thumbnail {
    asset-> {
      _id,
      url
    }
  },
  category-> {
    _id,
    title
  },
  modules[]-> {
    _id,
    title,
    description,
    isFree,
    cpCost,
    "lessonCount": count(lessons[]),
    "estimatedMinutes": count(lessons[]) * 15,
    lessons[]-> {
      _id,
      title,
      "slug": slug.current,
      description
    }
  },
  completedBy,
  "totalLessons": count(modules[]->lessons[]->_id),
  "totalModules": count(modules[]),
  "estimatedHours": round(count(modules[]->lessons[]->_id) * 15 / 60),
  "moduleCount": count(modules),
  "lessonCount": count(modules[]->lessons[]),
  "completedLessonCount": count(modules[]->lessons[]->completedBy[@==$userId])
}`);

export const LESSON_BY_ID_QUERY = defineQuery(`*[
  _type == "lesson"
  && _id == $id
][0] {
  _id,
  title,
  slug,
  description,
  video {
    asset-> {
      playbackId,
      status,
      data {
        duration
      }
    }
  },
  content,
  resources[]{
    _key,
    title,
    type,
    file {
      asset-> {
        url
      }
    },
    url
  },
  completedBy,
  "courses": *[_type == "course" && ^._id in modules[]->lessons[]->_id] | order(
    select(tier == "free" => 0, tier == "pro" => 1, tier == "ultra" => 2)
  ) {
    _id,
    title,
    slug,
    tier,
    modules[]-> {
      _id,
      title,
      lessons[]-> {
        _id,
        title,
        slug,
        completedBy
      }
    }
  }
}`);

export const LESSON_BY_SLUG_QUERY = defineQuery(`*[
  _type == "lesson"
  && slug.current == $slug
][0] {
  _id,
  title,
  slug,
  description,
  video {
    asset-> {
      playbackId,
      status,
      data {
        duration
      }
    }
  },
  content,
  resources[]{
    _key,
    title,
    type,
    file {
      asset-> {
        url
      }
    },
    url
  },
  completedBy,
  "moduleIsFree": *[_type == "module" && references(^._id)][0].isFree,
  "moduleId": *[_type == "module" && references(^._id)][0]._id,
  "moduleCpCost": *[_type == "module" && references(^._id)][0].cpCost,
  "moduleTotalLessons": count(*[_type == "module" && references(^._id)][0].lessons[]),
  "courseId": *[_type == "course" && references(*[_type == "module" && references(^._id)][0]._id)][0]._id,
  "courseSlug": *[_type == "course" && references(*[_type == "module" && references(^._id)][0]._id)][0].slug.current,
  "courses": *[_type == "course" && ^._id in modules[]->lessons[]->_id] | order(
    select(tier == "free" => 0, tier == "pro" => 1, tier == "ultra" => 2)
  ) {
    _id,
    title,
    slug,
    tier,
    modules[]-> {
      _id,
      title,
      lessons[]-> {
        _id,
        title,
        slug,
        completedBy
      }
    }
  }
}`);

export const LESSON_NAVIGATION_QUERY = defineQuery(`*[
  _type == "course"
  && $lessonId in modules[]->lessons[]->_id
][0] {
  _id,
  title,
  tier,
  modules[]-> {
    _id,
    title,
    isFree,
    lessons[]-> {
      _id,
      title
    }
  }
}`);


export const FIRST_FREE_COURSE_QUERY = groq`
  *[_type == "course" && tier == "free"] 
  | order(_createdAt asc) [0] {
    _id,
    title,
    "slug": slug.current,
    description,
    tier,
    modules[]->{
      _id,
      title,
      isFree,
      lessons[]->{
        _id,
        title,
        "slug": slug.current
      }
    }
  }
`;
