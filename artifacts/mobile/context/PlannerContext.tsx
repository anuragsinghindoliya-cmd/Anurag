import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUBJECTS, generateSchedule, type SubjectKey, type DaySchedule } from '@/data/plannerData';

export interface TestRecord {
  id: string;
  date: string;
  score: number;
  maxScore: number;
  type: 'chapter' | 'unit' | 'mock' | 'practice';
  notes: string;
}

export interface ChapterStatus {
  chapterId: string;
  subject: SubjectKey;
  lecturesWatched: number;
  totalLectures: number;
  completed: boolean;
  testsDone: TestRecord[];
  notes: string;
  startedAt?: string;
  completedAt?: string;
}

export interface DayTaskStatus {
  date: string;
  blockId: string;
  status: 'pending' | 'done' | 'not-done' | 'partial';
  lecturesDone: number;
  extraLectures: number;
  notes: string;
}

export interface PlannerState {
  chapters: Record<string, ChapterStatus>;
  tasks: Record<string, DayTaskStatus>;
  streak: number;
  lastStudyDate: string;
}

const STORAGE_KEY = 'anurag_planner_mobile_v1';

function getDefaultState(): PlannerState {
  const chapters: Record<string, ChapterStatus> = {};
  SUBJECTS.forEach(subject => {
    subject.chapters.forEach(chapter => {
      chapters[chapter.id] = {
        chapterId: chapter.id,
        subject: subject.key,
        lecturesWatched: 0,
        totalLectures: chapter.lectures,
        completed: false,
        testsDone: [],
        notes: '',
      };
    });
  });
  return { chapters, tasks: {}, streak: 0, lastStudyDate: '' };
}

interface PlannerContextValue {
  state: PlannerState;
  loaded: boolean;
  schedule: DaySchedule[];
  getSubjectProgress: (key: SubjectKey) => { totalLectures: number; doneLectures: number; totalChapters: number; doneChapters: number; pct: number };
  getOverallProgress: () => { total: number; done: number; totalCh: number; doneCh: number; pct: number };
  updateLectures: (chapterId: string, watched: number) => void;
  toggleChapterComplete: (chapterId: string) => void;
  updateTask: (blockId: string, date: string, updates: Partial<DayTaskStatus>) => void;
  getTask: (blockId: string, date: string) => DayTaskStatus;
  getDaySchedule: (dateStr: string) => DaySchedule | undefined;
  getWeekSchedule: (weekNum: number) => DaySchedule[];
  addTest: (chapterId: string, test: Omit<TestRecord, 'id'>) => void;
  deleteTest: (chapterId: string, testId: string) => void;
  updateChapterNotes: (chapterId: string, notes: string) => void;
  resetAll: () => void;
}

const PlannerContext = createContext<PlannerContextValue | null>(null);

const schedule = generateSchedule();

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [state, setStateRaw] = useState<PlannerState>(getDefaultState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as PlannerState;
          const def = getDefaultState();
          Object.keys(def.chapters).forEach(id => {
            if (!parsed.chapters[id]) parsed.chapters[id] = def.chapters[id];
          });
          setStateRaw(parsed);
        } catch { /* use default */ }
      }
      setLoaded(true);
    });
  }, []);

  const setState = useCallback((updater: (prev: PlannerState) => PlannerState) => {
    setStateRaw(prev => {
      const next = updater(prev);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getSubjectProgress = useCallback((subjectKey: SubjectKey) => {
    const subjectChapters = Object.values(state.chapters).filter(c => c.subject === subjectKey);
    const totalLectures = subjectChapters.reduce((s, c) => s + c.totalLectures, 0);
    const doneLectures  = subjectChapters.reduce((s, c) => s + Math.min(c.lecturesWatched, c.totalLectures), 0);
    const totalChapters = subjectChapters.length;
    const doneChapters  = subjectChapters.filter(c => c.completed).length;
    const pct = totalLectures > 0 ? Math.round((doneLectures / totalLectures) * 100) : 0;
    return { totalLectures, doneLectures, totalChapters, doneChapters, pct };
  }, [state.chapters]);

  const getOverallProgress = useCallback(() => {
    const all = Object.values(state.chapters);
    const total  = all.reduce((s, c) => s + c.totalLectures, 0);
    const done   = all.reduce((s, c) => s + Math.min(c.lecturesWatched, c.totalLectures), 0);
    const totalCh = all.length;
    const doneCh  = all.filter(c => c.completed).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, totalCh, doneCh, pct };
  }, [state.chapters]);

  const updateLectures = useCallback((chapterId: string, watched: number) => {
    setState(prev => {
      const ch = { ...prev.chapters[chapterId] };
      ch.lecturesWatched = Math.max(0, watched);
      ch.completed = ch.lecturesWatched >= ch.totalLectures;
      if (ch.completed && !ch.completedAt) ch.completedAt = new Date().toISOString();
      if (!ch.startedAt && ch.lecturesWatched > 0) ch.startedAt = new Date().toISOString();
      return { ...prev, chapters: { ...prev.chapters, [chapterId]: ch } };
    });
  }, [setState]);

  const toggleChapterComplete = useCallback((chapterId: string) => {
    setState(prev => {
      const ch = { ...prev.chapters[chapterId] };
      ch.completed = !ch.completed;
      if (ch.completed) { ch.lecturesWatched = ch.totalLectures; ch.completedAt = new Date().toISOString(); }
      else { ch.completedAt = undefined; }
      return { ...prev, chapters: { ...prev.chapters, [chapterId]: ch } };
    });
  }, [setState]);

  const updateTask = useCallback((blockId: string, date: string, updates: Partial<DayTaskStatus>) => {
    setState(prev => {
      const key = `${date}-${blockId}`;
      const existing = prev.tasks[key] || { date, blockId, status: 'pending' as const, lecturesDone: 0, extraLectures: 0, notes: '' };
      const updated = { ...existing, ...updates };

      let { streak, lastStudyDate } = prev;
      if (updates.status === 'done') {
        if (lastStudyDate !== date) {
          const last = lastStudyDate ? new Date(lastStudyDate) : null;
          const curr = new Date(date);
          if (last) {
            const diff = Math.round((curr.getTime() - last.getTime()) / 86400000);
            streak = diff === 1 ? streak + 1 : 1;
          } else { streak = 1; }
          lastStudyDate = date;
        }
      }
      return { ...prev, tasks: { ...prev.tasks, [key]: updated }, streak, lastStudyDate };
    });
  }, [setState]);

  const getTask = useCallback((blockId: string, date: string): DayTaskStatus => {
    const key = `${date}-${blockId}`;
    return state.tasks[key] || { date, blockId, status: 'pending', lecturesDone: 0, extraLectures: 0, notes: '' };
  }, [state.tasks]);

  const getDaySchedule = useCallback((dateStr: string) => schedule.find(d => d.date === dateStr), []);
  const getWeekSchedule = useCallback((weekNum: number) => schedule.filter(d => d.week === weekNum), []);

  const addTest = useCallback((chapterId: string, test: Omit<TestRecord, 'id'>) => {
    setState(prev => {
      const ch = { ...prev.chapters[chapterId] };
      ch.testsDone = [...ch.testsDone, { ...test, id: `test-${Date.now()}${Math.random().toString(36).substr(2, 5)}` }];
      return { ...prev, chapters: { ...prev.chapters, [chapterId]: ch } };
    });
  }, [setState]);

  const deleteTest = useCallback((chapterId: string, testId: string) => {
    setState(prev => {
      const ch = { ...prev.chapters[chapterId] };
      ch.testsDone = ch.testsDone.filter(t => t.id !== testId);
      return { ...prev, chapters: { ...prev.chapters, [chapterId]: ch } };
    });
  }, [setState]);

  const updateChapterNotes = useCallback((chapterId: string, notes: string) => {
    setState(prev => ({ ...prev, chapters: { ...prev.chapters, [chapterId]: { ...prev.chapters[chapterId], notes } } }));
  }, [setState]);

  const resetAll = useCallback(() => {
    const fresh = getDefaultState();
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    setStateRaw(fresh);
  }, []);

  return (
    <PlannerContext.Provider value={{
      state, loaded, schedule,
      getSubjectProgress, getOverallProgress,
      updateLectures, toggleChapterComplete,
      updateTask, getTask,
      getDaySchedule, getWeekSchedule,
      addTest, deleteTest, updateChapterNotes,
      resetAll,
    }}>
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error('usePlanner must be used inside PlannerProvider');
  return ctx;
}
