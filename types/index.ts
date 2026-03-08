/** User profile record */
export interface User {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  role: string
  subjects: string[] | null
  exam_board: string | null
  grade_level: string | null
  groq_api_key: string | null
  groq_key_verified: boolean
  onboarding_complete: boolean
  streak_count: number
  streak_freeze_active: boolean
  last_active: string | null
  created_at: string
}

/** Subject record */
export interface Subject {
  id: string
  name: string | null
  slug: string | null
  icon: string | null
  color: string | null
}

/** Topic record */
export interface Topic {
  id: string
  subject_id: string | null
  name: string | null
  slug: string | null
  order_index: number | null
}

/** Note record */
export interface Note {
  id: string
  topic_id: string | null
  title: string | null
  content: string | null
  created_at: string
  is_published: boolean
}

/** Question record */
export interface Question {
  id: string
  topic_id: string | null
  subject_id: string | null
  type: string | null
  difficulty: string | null
  question_text: string | null
  mark_scheme: string | null
  model_answer: string | null
  marks_available: number | null
  exam_board: string | null
  year: number | null
  source_material: string | null
  source_material_type: string | null
  source_image_url: string | null
  created_at: string
}

/** User question attempt record */
export interface UserAttempt {
  id: string
  user_id: string | null
  question_id: string | null
  user_answer: string | null
  ai_feedback: GradingResult | null
  score: number | null
  max_score: number | null
  attempt_number: number
  created_at: string
}

/** Past paper record */
export interface PastPaper {
  id: string
  subject_id: string | null
  year: number | null
  session: string | null
  paper_number: string | null
  exam_board: string | null
  file_url: string | null
  total_marks: number | null
  time_allowed_minutes: number | null
  has_source_material: boolean
  source_material_url: string | null
}

/** Paper attempt record */
export interface PaperAttempt {
  id: string
  user_id: string | null
  paper_id: string | null
  started_at: string | null
  completed_at: string | null
  is_timed: boolean | null
  total_score: number | null
  max_score: number | null
  grade_boundary_result: string | null
}

/** Individual question attempt within a paper */
export interface PaperQuestionAttempt {
  id: string
  paper_attempt_id: string | null
  question_id: string | null
  user_answer: string | null
  answer_image_url: string | null
  answer_mode: string | null
  ai_feedback: GradingResult | null
  score: number | null
  max_score: number | null
}

/** Flashcard record */
export interface Flashcard {
  id: string
  user_id: string | null
  subject_id: string | null
  topic_id: string | null
  front_text: string | null
  back_text: string | null
  is_custom: boolean
  spaced_rep_due_date: string
  ease_factor: number
  interval_days: number
}

/** Bookmark record */
export interface Bookmark {
  id: string
  user_id: string | null
  note_id: string | null
  created_at: string
}

/** Glossary term record */
export interface GlossaryTerm {
  id: string
  subject_id: string | null
  term: string | null
  definition: string | null
  linked_topic_id: string | null
}

/** Diagram record */
export interface Diagram {
  id: string
  subject_id: string | null
  topic_id: string | null
  title: string | null
  description: string | null
  file_url: string | null
  is_interactive: boolean
}

/** Teacher profile record */
export interface TeacherProfile {
  id: string
  user_id: string | null
  bio: string | null
  qualifications: string | null
  subjects: string[] | null
  exam_boards: string[] | null
  grade_levels: string[] | null
  hourly_rate: number | null
  teaching_mode: string | null
  is_verified: boolean
  rating_average: number
  rating_count: number
}

/** Availability slot record */
export interface AvailabilitySlot {
  id: string
  teacher_id: string | null
  day_of_week: number | null
  start_time: string | null
  end_time: string | null
  is_recurring: boolean
}

/** Connection request record */
export interface ConnectionRequest {
  id: string
  student_id: string | null
  teacher_id: string | null
  message: string | null
  status: string
  created_at: string
}

/** Message record */
export interface Message {
  id: string
  sender_id: string | null
  receiver_id: string | null
  content: string | null
  file_url: string | null
  is_read: boolean
  created_at: string
}

/** Review record */
export interface Review {
  id: string
  student_id: string | null
  teacher_id: string | null
  rating: number | null
  comment: string | null
  created_at: string
}

/** Assignment record */
export interface Assignment {
  id: string
  teacher_id: string | null
  student_id: string | null
  subject_id: string | null
  title: string | null
  description: string | null
  due_date: string | null
  status: string
}

/** Assignment submission record */
export interface AssignmentSubmission {
  id: string
  assignment_id: string | null
  student_id: string | null
  content: string | null
  file_url: string | null
  ai_feedback: GradingResult | null
  teacher_feedback: string | null
  score: number | null
  submitted_at: string
}

/** Achievement badge record */
export interface Achievement {
  id: string
  user_id: string | null
  badge_slug: string | null
  earned_at: string
}

/** Study goal record */
export interface StudyGoal {
  id: string
  user_id: string | null
  subject_id: string | null
  questions_per_week_target: number | null
  created_at: string
}

/** AI grading feedback result */
export interface GradingResult {
  score: number
  max_score: number
  correct: string
  missing: string
  improve: string
  method_marks?: number
  kaa_breakdown?: {
    knowledge: string
    application: string
    analysis: string
    evaluation: string
  }
  logic_errors?: string
  output_accuracy?: string
}

/** Progress analytics output shape */
export interface ProgressData {
  overall_accuracy: number
  total_attempts: number
  by_subject: {
    [subject_slug: string]: {
      accuracy: number
      attempts: number
      by_topic: {
        [topic_name: string]: {
          accuracy: number
          attempts: number
          is_weak: boolean
        }
      }
    }
  }
  score_trend: Array<{ date: string; score: number; subject: string }>
  weak_topics: string[]
}
