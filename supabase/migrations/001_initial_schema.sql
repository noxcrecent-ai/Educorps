-- EduCorps Initial Schema Migration
-- 001_initial_schema.sql

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email               TEXT,
  full_name           TEXT,
  avatar_url          TEXT,
  role                TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  subjects            TEXT[],
  exam_board          TEXT,
  grade_level         TEXT,
  groq_api_key        TEXT,
  groq_key_verified   BOOLEAN NOT NULL DEFAULT FALSE,
  onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE,
  streak_count        INTEGER NOT NULL DEFAULT 0,
  streak_freeze_active BOOLEAN NOT NULL DEFAULT FALSE,
  last_active         DATE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- SUBJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subjects (
  id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name  TEXT,
  slug  TEXT UNIQUE,
  icon  TEXT,
  color TEXT
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subjects are publicly readable"
  ON public.subjects FOR SELECT
  USING (TRUE);

-- ============================================================
-- TOPICS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.topics (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id  UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  name        TEXT,
  slug        TEXT,
  order_index INTEGER
);

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Topics are publicly readable"
  ON public.topics FOR SELECT
  USING (TRUE);

-- ============================================================
-- NOTES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notes (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id     UUID REFERENCES public.topics(id) ON DELETE CASCADE,
  title        TEXT,
  content      TEXT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published notes are publicly readable"
  ON public.notes FOR SELECT
  USING (is_published = TRUE);

-- ============================================================
-- QUESTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.questions (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id             UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  subject_id           UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  type                 TEXT CHECK (type IN ('short_answer', 'long_answer', 'calculation', 'essay', 'multiple_choice', 'data_response')),
  difficulty           TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question_text        TEXT,
  mark_scheme          TEXT,
  model_answer         TEXT,
  marks_available      INTEGER,
  exam_board           TEXT,
  year                 INTEGER,
  source_material      TEXT,
  source_material_type TEXT CHECK (source_material_type IN ('text', 'image', 'data', 'graph')),
  source_image_url     TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questions are publicly readable"
  ON public.questions FOR SELECT
  USING (TRUE);

-- ============================================================
-- USER ATTEMPTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_attempts (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID REFERENCES public.users(id) ON DELETE CASCADE,
  question_id    UUID REFERENCES public.questions(id) ON DELETE SET NULL,
  user_answer    TEXT,
  ai_feedback    JSONB,
  score          NUMERIC,
  max_score      NUMERIC,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own attempts"
  ON public.user_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own attempts"
  ON public.user_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- PAST PAPERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.past_papers (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id            UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  year                  INTEGER,
  session               TEXT CHECK (session IN ('May/June', 'Oct/Nov', 'Jan/Feb')),
  paper_number          TEXT,
  exam_board            TEXT,
  file_url              TEXT,
  total_marks           INTEGER,
  time_allowed_minutes  INTEGER,
  has_source_material   BOOLEAN NOT NULL DEFAULT FALSE,
  source_material_url   TEXT
);

ALTER TABLE public.past_papers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Past papers are publicly readable"
  ON public.past_papers FOR SELECT
  USING (TRUE);

-- ============================================================
-- PAPER ATTEMPTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.paper_attempts (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID REFERENCES public.users(id) ON DELETE CASCADE,
  paper_id              UUID REFERENCES public.past_papers(id) ON DELETE SET NULL,
  started_at            TIMESTAMPTZ,
  completed_at          TIMESTAMPTZ,
  is_timed              BOOLEAN,
  total_score           NUMERIC,
  max_score             NUMERIC,
  grade_boundary_result TEXT
);

ALTER TABLE public.paper_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own paper attempts"
  ON public.paper_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own paper attempts"
  ON public.paper_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own paper attempts"
  ON public.paper_attempts FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- PAPER QUESTION ATTEMPTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.paper_question_attempts (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paper_attempt_id UUID REFERENCES public.paper_attempts(id) ON DELETE CASCADE,
  question_id      UUID REFERENCES public.questions(id) ON DELETE SET NULL,
  user_answer      TEXT,
  answer_image_url TEXT,
  answer_mode      TEXT CHECK (answer_mode IN ('text', 'image', 'typed')),
  ai_feedback      JSONB,
  score            NUMERIC,
  max_score        NUMERIC
);

ALTER TABLE public.paper_question_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own paper question attempts"
  ON public.paper_question_attempts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.paper_attempts pa
      WHERE pa.id = paper_attempt_id AND pa.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own paper question attempts"
  ON public.paper_question_attempts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.paper_attempts pa
      WHERE pa.id = paper_attempt_id AND pa.user_id = auth.uid()
    )
  );

-- ============================================================
-- FLASHCARDS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.flashcards (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID REFERENCES public.users(id) ON DELETE CASCADE,
  subject_id          UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  topic_id            UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  front_text          TEXT,
  back_text           TEXT,
  is_custom           BOOLEAN NOT NULL DEFAULT FALSE,
  spaced_rep_due_date DATE NOT NULL DEFAULT CURRENT_DATE,
  ease_factor         NUMERIC NOT NULL DEFAULT 2.5,
  interval_days       INTEGER NOT NULL DEFAULT 1
);

ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own and system flashcards"
  ON public.flashcards FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can insert their own flashcards"
  ON public.flashcards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own flashcards"
  ON public.flashcards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own flashcards"
  ON public.flashcards FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- BOOKMARKS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES public.users(id) ON DELETE CASCADE,
  note_id    UUID REFERENCES public.notes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, note_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookmarks"
  ON public.bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
  ON public.bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON public.bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- GLOSSARY TERMS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.glossary_terms (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id       UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  term             TEXT,
  definition       TEXT,
  linked_topic_id  UUID REFERENCES public.topics(id) ON DELETE SET NULL
);

ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Glossary terms are publicly readable"
  ON public.glossary_terms FOR SELECT
  USING (TRUE);

-- ============================================================
-- DIAGRAMS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.diagrams (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id     UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  topic_id       UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  title          TEXT,
  description    TEXT,
  file_url       TEXT,
  is_interactive BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE public.diagrams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Diagrams are publicly readable"
  ON public.diagrams FOR SELECT
  USING (TRUE);

-- ============================================================
-- TEACHER PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.teacher_profiles (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  bio            TEXT,
  qualifications TEXT,
  subjects       TEXT[],
  exam_boards    TEXT[],
  grade_levels   TEXT[],
  hourly_rate    NUMERIC,
  teaching_mode  TEXT CHECK (teaching_mode IN ('online', 'in-person', 'both')),
  is_verified    BOOLEAN NOT NULL DEFAULT FALSE,
  rating_average NUMERIC NOT NULL DEFAULT 0,
  rating_count   INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teacher profiles are publicly readable"
  ON public.teacher_profiles FOR SELECT
  USING (TRUE);

CREATE POLICY "Teachers can update their own profile"
  ON public.teacher_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Teachers can insert their own profile"
  ON public.teacher_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- AVAILABILITY SLOTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.availability_slots (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id   UUID REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
  day_of_week  INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
  start_time   TIME,
  end_time     TIME,
  is_recurring BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Availability slots are publicly readable"
  ON public.availability_slots FOR SELECT
  USING (TRUE);

CREATE POLICY "Teachers can manage their own availability"
  ON public.availability_slots FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.teacher_profiles tp
      WHERE tp.id = teacher_id AND tp.user_id = auth.uid()
    )
  );

-- ============================================================
-- CONNECTION REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.connection_requests (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  message    TEXT,
  status     TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students and teachers can view their own connection requests"
  ON public.connection_requests FOR SELECT
  USING (auth.uid() = student_id OR auth.uid() = teacher_id);

CREATE POLICY "Students can create connection requests"
  ON public.connection_requests FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers can update connection request status"
  ON public.connection_requests FOR UPDATE
  USING (auth.uid() = teacher_id);

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id   UUID REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content     TEXT,
  file_url    TEXT,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages they sent or received"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Receivers can mark messages as read"
  ON public.messages FOR UPDATE
  USING (auth.uid() = receiver_id);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  rating     INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, teacher_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are publicly readable"
  ON public.reviews FOR SELECT
  USING (TRUE);

CREATE POLICY "Students can insert their own reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = student_id);

-- ============================================================
-- ASSIGNMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.assignments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id  UUID REFERENCES public.users(id) ON DELETE CASCADE,
  student_id  UUID REFERENCES public.users(id) ON DELETE CASCADE,
  subject_id  UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  title       TEXT,
  description TEXT,
  due_date    TIMESTAMPTZ,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'graded', 'returned')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students and teachers can view their assignments"
  ON public.assignments FOR SELECT
  USING (auth.uid() = student_id OR auth.uid() = teacher_id);

CREATE POLICY "Teachers can create assignments"
  ON public.assignments FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update assignments"
  ON public.assignments FOR UPDATE
  USING (auth.uid() = teacher_id);

-- ============================================================
-- ASSIGNMENT SUBMISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id    UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id       UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content          TEXT,
  file_url         TEXT,
  ai_feedback      JSONB,
  teacher_feedback TEXT,
  score            NUMERIC,
  submitted_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students and teachers can view submissions"
  ON public.assignment_submissions FOR SELECT
  USING (
    auth.uid() = student_id OR
    EXISTS (
      SELECT 1 FROM public.assignments a
      WHERE a.id = assignment_id AND a.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can submit their own assignments"
  ON public.assignment_submissions FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers can update submissions (for grading)"
  ON public.assignment_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments a
      WHERE a.id = assignment_id AND a.teacher_id = auth.uid()
    )
  );

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES public.users(id) ON DELETE CASCADE,
  badge_slug TEXT,
  earned_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, badge_slug)
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements"
  ON public.achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert achievements"
  ON public.achievements FOR INSERT
  WITH CHECK (TRUE);

-- ============================================================
-- STUDY GOALS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.study_goals (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                   UUID REFERENCES public.users(id) ON DELETE CASCADE,
  subject_id                UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  questions_per_week_target INTEGER,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, subject_id)
);

ALTER TABLE public.study_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own study goals"
  ON public.study_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study goals"
  ON public.study_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study goals"
  ON public.study_goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study goals"
  ON public.study_goals FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_topics_subject_id ON public.topics(subject_id);
CREATE INDEX IF NOT EXISTS idx_notes_topic_id ON public.notes(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_subject_id ON public.questions(subject_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic_id ON public.questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_user_attempts_user_id ON public.user_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_attempts_question_id ON public.user_attempts(question_id);
CREATE INDEX IF NOT EXISTS idx_paper_attempts_user_id ON public.paper_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_paper_question_attempts_paper_attempt_id ON public.paper_question_attempts(paper_attempt_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_user_id ON public.flashcards(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_due_date ON public.flashcards(spaced_rep_due_date);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_connection_requests_student_id ON public.connection_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_connection_requests_teacher_id ON public.connection_requests(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher_id ON public.assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_student_id ON public.assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements(user_id);
