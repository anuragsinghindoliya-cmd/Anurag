export type SubjectKey = 'physics' | 'chemistry' | 'math' | 'english' | 'hindi';

export interface Chapter {
  id: string;
  name: string;
  lectures: number;
  isBasics?: boolean;
}

export interface Subject {
  key: SubjectKey;
  label: string;
  color: string;
  icon: string;
  chapters: Chapter[];
}

const physicsChapters: Chapter[] = [
  { id: 'phy-basics', name: 'Basics / Foundation', lectures: 5, isBasics: true },
  { id: 'phy-1',  name: 'Ch 1: Electric Charges & Fields',            lectures: 10 },
  { id: 'phy-2',  name: 'Ch 2: Electrostatic Potential & Capacitance', lectures: 10 },
  { id: 'phy-3',  name: 'Ch 3: Current Electricity',                  lectures: 7  },
  { id: 'phy-4',  name: 'Ch 4: Moving Charges & Magnetism',           lectures: 7  },
  { id: 'phy-5',  name: 'Ch 5: Magnetism & Matter',                   lectures: 4  },
  { id: 'phy-6',  name: 'Ch 6: Electromagnetic Induction',            lectures: 7  },
  { id: 'phy-7',  name: 'Ch 7: Alternating Current',                  lectures: 5  },
  { id: 'phy-8',  name: 'Ch 8: Electromagnetic Waves',                lectures: 2  },
  { id: 'phy-9',  name: 'Ch 9: Ray Optics & Optical Instruments',     lectures: 4  },
  { id: 'phy-9b', name: 'Ch 9B: Wave Optics',                         lectures: 9  },
  { id: 'phy-10', name: 'Ch 10: Dual Nature of Radiation',            lectures: 4  },
  { id: 'phy-11', name: 'Ch 11: Atoms',                               lectures: 2  },
  { id: 'phy-11b',name: 'Ch 11B: Nuclei',                             lectures: 7  },
  { id: 'phy-other', name: 'Other Basics / Revision Topics',          lectures: 7, isBasics: true },
];

const chemistryChapters: Chapter[] = [
  { id: 'chem-basics', name: 'Basics / Foundation',                   lectures: 5, isBasics: true },
  { id: 'chem-1',  name: 'Ch 1: Solutions',                           lectures: 7  },
  { id: 'chem-2',  name: 'Ch 2: Electrochemistry',                    lectures: 7  },
  { id: 'chem-3',  name: 'Ch 3: Chemical Kinetics',                   lectures: 8  },
  { id: 'chem-4',  name: 'Ch 4: The d & f Block Elements',            lectures: 5  },
  { id: 'chem-5',  name: 'Ch 5: Coordination Compounds',              lectures: 7  },
  { id: 'chem-6',  name: 'Ch 6: Haloalkanes & Haloarenes',            lectures: 2  },
  { id: 'chem-7',  name: 'Ch 7: Alcohols, Phenols & Ethers',          lectures: 1  },
  { id: 'chem-8',  name: 'Ch 8: Aldehydes, Ketones & Carboxylic Acids', lectures: 7 },
  { id: 'chem-9',  name: 'Ch 9: Amines',                              lectures: 9  },
  { id: 'chem-10', name: 'Ch 10: Biomolecules',                       lectures: 3  },
];

const mathChapters: Chapter[] = [
  { id: 'math-basics', name: 'Basics / Foundation',                   lectures: 5, isBasics: true },
  { id: 'math-1',  name: 'Ch 1: Relations & Functions',               lectures: 10 },
  { id: 'math-2',  name: 'Ch 2: Inverse Trigonometric Functions',     lectures: 6  },
  { id: 'math-3',  name: 'Ch 3: Matrices',                            lectures: 8  },
  { id: 'math-4',  name: 'Ch 4: Determinants',                        lectures: 9  },
  { id: 'math-5',  name: 'Ch 5: Continuity & Differentiability',      lectures: 10 },
  { id: 'math-6',  name: 'Ch 6: Application of Derivatives',          lectures: 9  },
  { id: 'math-7',  name: 'Ch 7: Integrals',                           lectures: 12 },
  { id: 'math-8',  name: 'Ch 8: Application of Integrals',            lectures: 5  },
  { id: 'math-9',  name: 'Ch 9: Differential Equations',              lectures: 8  },
  { id: 'math-10', name: 'Ch 10: Vector Algebra',                     lectures: 7  },
  { id: 'math-11', name: 'Ch 11: Three Dimensional Geometry',         lectures: 8  },
  { id: 'math-12', name: 'Ch 12: Linear Programming',                 lectures: 4  },
  { id: 'math-13', name: 'Ch 13: Probability',                        lectures: 9  },
];

const englishChapters: Chapter[] = [
  { id: 'eng-1', name: 'Flamingo – Prose Sections',    lectures: 8 },
  { id: 'eng-2', name: 'Flamingo – Poetry',            lectures: 6 },
  { id: 'eng-3', name: 'Vistas (Supplementary Reader)',lectures: 6 },
  { id: 'eng-4', name: 'Writing Skills & Grammar',     lectures: 6 },
];

const hindiChapters: Chapter[] = [
  { id: 'hin-1', name: 'Aroh – Kavita (Poetry)',         lectures: 8 },
  { id: 'hin-2', name: 'Aroh – Gadya (Prose)',           lectures: 6 },
  { id: 'hin-3', name: 'Vitan (Supplementary)',          lectures: 4 },
  { id: 'hin-4', name: 'Lekhan Kaushal (Writing)',       lectures: 4 },
];

export const SUBJECTS: Subject[] = [
  { key: 'physics',   label: 'Physics',   color: '#00d4ff', icon: 'zap',      chapters: physicsChapters   },
  { key: 'chemistry', label: 'Chemistry', color: '#00e5a0', icon: 'droplet',  chapters: chemistryChapters },
  { key: 'math',      label: 'Math',      color: '#6c63ff', icon: 'percent',  chapters: mathChapters      },
  { key: 'english',   label: 'English',   color: '#ffb347', icon: 'book',     chapters: englishChapters   },
  { key: 'hindi',     label: 'Hindi',     color: '#ff6b9d', icon: 'edit-2',   chapters: hindiChapters     },
];

export const PHASE1_WEEKS = 3;
export const PHASE2_WEEKS = 21;
export const PLAN_START_DATE = new Date('2026-06-21');

export interface DaySchedule {
  date: string;
  dayType: 'A' | 'B' | 'SUNDAY';
  phase: 1 | 2;
  week: number;
  dayOfWeek: string;
  isHybridDay: boolean;
  blocks: Block[];
}

export interface Block {
  id: string;
  label: string;
  subject: SubjectKey;
  blockType: 'study' | 'revision' | 'language';
  lecturesPlanned: number;
  timeSlot: string;
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

export function generateSchedule(): DaySchedule[] {
  const schedule: DaySchedule[] = [];
  const current = new Date(PLAN_START_DATE);
  let dayAB: 'A' | 'B' = 'A';

  for (let weekNum = 1; weekNum <= 24; weekNum++) {
    for (let d = 0; d < 7; d++) {
      const dow = current.getDay();
      const dateStr = formatDate(current);
      const phase: 1 | 2 = weekNum <= 3 ? 1 : 2;
      const isFriday   = dow === 5;
      const isSaturday = dow === 6;
      const isSunday   = dow === 0;

      if (isSunday) {
        schedule.push({ date: dateStr, dayType: 'SUNDAY', phase, week: weekNum, dayOfWeek: 'Sunday', isHybridDay: false, blocks: [] });
      } else {
        const isHybrid = (isFriday || isSaturday) && phase === 2;
        const type = isSaturday ? 'B' : dayAB;
        const blocks: Block[] = [];

        if (type === 'A') {
          blocks.push({
            id: `${dateStr}-phy`,
            label: 'Physics',
            subject: 'physics',
            blockType: isHybrid ? 'revision' : 'study',
            lecturesPlanned: phase === 1 ? 1 : (isHybrid ? 1 : 2),
            timeSlot: 'Block 1: 6:00 AM – 8:00 AM',
          });
          blocks.push({
            id: `${dateStr}-chem`,
            label: 'Chemistry',
            subject: 'chemistry',
            blockType: isHybrid ? 'revision' : 'study',
            lecturesPlanned: 1,
            timeSlot: 'Block 2: 12:00 PM – 2:00 PM',
          });
        } else {
          const isEnglish = weekNum % 2 === 1;
          blocks.push({
            id: `${dateStr}-math`,
            label: 'Math',
            subject: 'math',
            blockType: isHybrid ? 'revision' : 'study',
            lecturesPlanned: phase === 1 ? 1 : (isHybrid ? 1 : 2),
            timeSlot: 'Block 1: 6:00 AM – 8:00 AM',
          });
          // Language blocks only in Phase 2
          if (phase === 2) {
            blocks.push({
              id: `${dateStr}-lang`,
              label: isEnglish ? 'English' : 'Hindi',
              subject: isEnglish ? 'english' : 'hindi',
              blockType: 'language',
              lecturesPlanned: 1,
              timeSlot: 'Block 2: 12:00 PM – 12:45 PM',
            });
          }
        }

        schedule.push({
          date: dateStr,
          dayType: type as 'A' | 'B',
          phase,
          week: weekNum,
          dayOfWeek: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dow],
          isHybridDay: isHybrid,
          blocks,
        });

        if (!isSaturday) {
          dayAB = dayAB === 'A' ? 'B' : 'A';
        }
      }

      current.setDate(current.getDate() + 1);
    }
  }

  return schedule;
}

export interface MonthlyTarget {
  month: string;
  physicsChapters: number;
  chemistryChapters: number;
  mathChapters: number;
  note: string;
  phase: string;
}

export const MONTHLY_TARGETS: MonthlyTarget[] = [
  { month: 'June (Wks 1–2)',              physicsChapters: 1, chemistryChapters: 1, mathChapters: 0, note: 'Phase 1 — Rhythm Builder: Basics + Ch1 start. 1 lecture/session. Jun 21 – Jul 4.',                          phase: '1'     },
  { month: 'July (Wks 3–6)',              physicsChapters: 2, chemistryChapters: 2, mathChapters: 2, note: 'Phase 1→2 transition. Ch2–Ch3 Physics, Ch2–Ch3 Chem. Pace increases. Jul 5 – Aug 1.',                       phase: '1→2'   },
  { month: 'August (Wks 7–11)',           physicsChapters: 3, chemistryChapters: 3, mathChapters: 3, note: 'Phase 2 Full Sprint — 2 lectures/session. Ch4–Ch6 Physics, Ch4–Ch6 Chem, Ch3–Ch5 Math. Aug 2 – Sep 5.',    phase: '2'     },
  { month: 'Sep – Oct (Wks 12–16)',       physicsChapters: 3, chemistryChapters: 3, mathChapters: 3, note: 'Deep execution. Ch7–Ch9 Physics, Ch7–Ch9 Chem, Ch6–Ch8 Math. Friday/Sat Spaced Recall. Sep 6 – Oct 10.',   phase: '2'     },
  { month: 'Oct – Nov (Wks 17–21)',       physicsChapters: 4, chemistryChapters: 2, mathChapters: 4, note: 'Final push. Ch9B–Ch11B Physics, Ch10 Chem. Ch9–Ch12 Math. Blank-sheet method intensive. Oct 11 – Nov 14.', phase: '2'     },
  { month: 'Nov – Dec Wk 1 (Buffer)',     physicsChapters: 0, chemistryChapters: 0, mathChapters: 1, note: 'Full Syllabus Completion + Grand Revision. Ch13 Math + Mock Tests. Nov 15 – Dec 7.',                        phase: 'FINAL' },
];
