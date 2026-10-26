// School self-evaluation instruments, transcribed from the 2027 templates.
//
// NOTE: the templates only show the *selected* "current situation" for each row, not the full
// dropdown. The option lists below were reconstructed from those selected values (ordered best →
// worst) and can be edited freely. No answers or ratings from the templates are included: the
// form starts blank.
import type { Instrument } from "./instrumentTypes.js";

// ---------- shared option sets ----------

const FREQUENCY = ["ALWAYS", "MOST OF THE TIME", "SOMETIMES", "IRREGULARLY", "NEVER"];
const YES_NO = ["YES", "NO"];
const YES_PARTLY_NO = ["YES", "PARTLY", "NO"];
const AVAILABILITY = [
  "AVAILABLE - ALL ASPECTS IN ORDER",
  "AVAILABLE - MAJORITY ASPECTS IN ORDER",
  "AVAILABLE - SOME ASPECTS IN ORDER",
  "NOT AVAILABLE",
];
const DOC_AVAILABLE = ["AVAILABLE", "PARTLY AVAILABLE", "NOT AVAILABLE"];
const DOC_UPDATED = [
  "AVAILABLE AND FULLY UPDATED",
  "AVAILABLE, MAJORITY ASPECTS IN ORDER",
  "AVAILABLE, NOT UPDATED",
  "NOT AVAILABLE",
];
const CONDITION = ["GOOD", "FAIR", "POOR"];
const UPDATE_STATUS = ["FULLY UPDATED", "PARTLY UPDATED", "NOT UPDATED"];
const REGULARITY = ["REGULAR", "IRREGULAR", "NONE"];
/** Percentage of educators / classes / lessons */
const PERCENT_BANDS = ["100%", "MORE THAN 80%", "MORE THAN 60%", "LESS THAN 60%"];
const CLASSROOM_PERCENT = ["70 - 100%", "50 - 69%", "30 - 49%", "LESS THAN 30%"];
const LEARNER_WORK_PERCENT = ["MORE THAN 80%", "MORE THAN 50%", "LESS THAN 50%"];
const PHASE_IMPLEMENTATION = [
  "FULL IMPLEMENTATION (MORE THAN 80%)",
  "SUBSTANTIAL IMPLEMENTATION (60% - 80%)",
  "PARTIAL IMPLEMENTATION (40% - 59%)",
  "LIMITED IMPLEMENTATION (LESS THAN 40%)",
];

/** Implementation levels with a template-specific description, e.g. implementation("CONDUCTED CONSISTENTLY"). */
const implementation = (full: string, substantial: string, partial = "SOME EVIDENCE", none = "NO EVIDENCE") => [
  `FULLY IMPLEMENTED: ${full}`,
  `SUBSTANTIALLY IMPLEMENTED: ${substantial}`,
  `PARTIALLY IMPLEMENTED: ${partial}`,
  `NOT IMPLEMENTED: ${none}`,
];

const PHASES = ["FP", "IP", "SP", "FET"];
const TERRAIN = [
  "Walls", "Ceilings", "Doors", "Windows", "Floors", "Toilets", "Taps",
  "Electrical fittings", "Roof", "Fence", "Gutters", "Walkways", "Staircases",
];

// Repeated headings
const TIME_ON_TASK = "Timetable adherence: Time on task by protecting instructional time";
const ATTENDANCE = "Class Attendance Records (online)";
const LCOC = "Code of Conduct for Learners";
const LCOC_CONTENT = "Content of the Learner Code of Conduct";
const ECOC = "Code of Conduct of Educators (overlaps with learner conduct)";
const REGISTERS = "Registers: The principal ensures the completion of all attendance registers and leave forms";
const ADMIN_SYSTEMS = "Effective administrative systems";

const SIP =
  "SIP - SSE informs the content of SIP and Annual Academic Improvement Plans (APIP). CMs review progress of implementation of SIP with principals and with their workplans during quarterly SIM process. Annual review of implementation of all action plans are done in conjunction with principals' performance reviews. Clear targets are set, and measures are in place to address potential risks.";
const OBSERVATIONS =
  "Providing leadership, mentoring, support and development. Conducts classroom observations to support and develop educators. Monitors staff appraisal (QMS) and verifies the evidence.";
const PROF_DEV = "Professional Development: Staff training and development sessions are planned and implemented.";
const LABOUR =
  "Ensures that a positive labour environment exists:\n2.13.1 Affirms educators.\n2.13.2 Manages underperformance appropriately.\n2.13.3 Follows correct procedures when dealing with staff grievances.";

const LT_ENVIRONMENT =
  "Criterion 1: Learning and teaching environment: The use of the learning and teaching environment enables all learners to be productively engaged in individual and cooperative learning.";
const CLASS_MANAGEMENT =
  "Criterion 2: Classroom Management: Time and available resources are managed to promote optimal learning and teaching for all learners. Activities are efficiently supervised. Learners work together with the educator towards the achievement of relevant learning outcomes.";
const SUBJECT_KNOWLEDGE =
  "Criterion 1: Knowledge of subject: Uses expert knowledge, in addition to outcomes and assessment standards, to promote learner interest and research in the specific subject.";
const PLANNING =
  "Criterion 2: Planning and presentation: Effective use of planning instruments leads towards a higher form of understanding.";
const WORK_SCHEDULE =
  "Criterion 3: Management of work schedule: Excellent management of content and context within the timeframes stipulated in the Work Schedule / ATP accompanied by relevant intervention strategies.";
const RECORD_KEEPING =
  "Criterion 4: Record Keeping: Records are meticulously maintained and analysed to diagnose learner needs and teaching effectiveness. Records are used to adjust teaching strategies and improve learner achievement.";
const FEEDBACK =
  "Criterion 1: Feedback to learners: Provides feedback using a variety of strategies. Uses remedial and enrichment measures that instill confidence in learners to achieve intended learning outcomes.";
const ASSESSMENT_FORMS =
  "Criterion 2: Knowledge and application of forms of assessment: Knows and uses a range of forms of assessment techniques to continuously maximise learner achievement. Various methods of assessment are used to raise the standards of teaching and learning.";
const LEARNER_PROGRESS =
  "Criterion 3: Learner progress and achievement: Learners optimally achieve the relevant subject outcomes. Assessment results show outstanding levels of competence and achievement.";
const LEARNER_WORK = "QUALITY OF LEARNER WORK";
const SBST = "SCHOOL BASED SUPPORT TEAM (SBST)";

const LTSM =
  "The SMT manages the distribution and retrieval of textbooks and teaching aids, in accordance with the LTSM / Textbook Policy";

const SGB = "SGB Functionality";
const FINANCE = "Financial Management";
const ASSETS = "Asset Management";
const HR = "Human Resource Management";

const BASIC_SERVICES = "Basic Services";
const TERRAIN_MAINTENANCE = "School terrain - effective implementation of Maintenance Policy";

// ---------- instruments ----------

export const INSTRUMENTS: Instrument[] = [
  // =====================================================================
  {
    number: 1,
    title: "Basic Functionality",
    purpose:
      "To evaluate whether the school functions efficiently and effectively and that a positive ethos prevails to realise its educational and social goals",
    items: [
      {
        code: "1.1.1.1",
        heading: "Functional Timetable",
        indicator:
          "Functional Timetable\nCorrect time allocation of subjects and fair distribution of work for all staff members. The subject offering contact time and notional time is accurate.",
        options: ["FULLY CAPS COMPLIANT", "MOSTLY CAPS COMPLIANT", "PARTLY CAPS COMPLIANT", "NOT CAPS COMPLIANT"],
      },
      {
        code: "1.1.2.1",
        heading: TIME_ON_TASK,
        indicator:
          "The principal ensures protection of instructional time\n1. Time on task - Encourage educators to use instructional time for teaching and practicing new skills and concepts.",
        options: ["100%", "80 - 99%", "60 - 79%", "LESS THAN 60%"],
      },
      {
        code: "1.1.2.2",
        heading: TIME_ON_TASK,
        indicator: "2. Timetable observance: Regularity of educators in class during teaching time.",
        options: ["ALL OF THE TIME", "MOST OF THE TIME", "SOME OF THE TIME", "SELDOM"],
      },
      {
        code: "1.1.2.3",
        heading: TIME_ON_TASK,
        indicator: "3. Percentage of interruptions of daily academic programme due to non-academic issues.",
        options: ["LESS THAN 5%", "5 - 10%", "11 - 20%", "MORE THAN 20%"],
      },
      {
        code: "1.1.3.1",
        heading: ATTENDANCE,
        indicator: "Learner attendance\n1. The SMT monitors the online attendance registers effectively and reports this in SMT meetings.",
        options: ["ALWAYS", "REGULARLY", "IRREGULARLY", "NEVER"],
      },
      {
        code: "1.1.3.2",
        heading: ATTENDANCE,
        indicator: "2. Percentage of Learners that were absent during the previous quarter.",
        options: ["LESS THAN 5%", "5 - 10%", "11 - 20%", "MORE THAN 20%"],
      },
      {
        code: "1.1.3.3",
        heading: ATTENDANCE,
        indicator: "3. Absence patterns are identified and followed up by relevant educator.",
        options: FREQUENCY,
      },
      {
        code: "1.1.4.1",
        heading: LCOC,
        indicator: "Implementation of Code of Conduct:\n1. The Learner Code of Conduct is applied consistently in all classes.",
        options: FREQUENCY,
      },
      {
        code: "1.1.4.2",
        heading: LCOC,
        indicator: "2. Follow-up and consequences for learners who transgress the school rules conducted within a reasonable time.",
        options: FREQUENCY,
      },
      {
        code: "1.1.5.1",
        heading: LCOC,
        indicator: "Learner Truancy:\nThere is timeous follow up and consequences for learners who play truant.",
        options: FREQUENCY,
      },
      {
        code: "1.1.6.1",
        heading: LCOC,
        indicator: "Learner Punctuality\nThere is timeous follow up and consequences for learners who are chronically late for school.",
        options: FREQUENCY,
      },
      { code: "1.1.7.1", heading: LCOC_CONTENT, indicator: "1. The Code of Conduct of Learners is relevant to the context of the school.", options: YES_PARTLY_NO },
      {
        code: "1.1.7.2",
        heading: LCOC_CONTENT,
        indicator: "2. Offences are graded. Procedures for Grades 1-4 offences are explained in the Code of Conduct.",
        options: YES_PARTLY_NO,
      },
      { code: "1.1.7.3", heading: LCOC_CONTENT, indicator: "3. A record of offences committed by learners is available.", options: YES_PARTLY_NO },
      { code: "1.1.7.4", heading: LCOC_CONTENT, indicator: "4. The school has a Disciplinary Committee.", options: YES_NO },
      { code: "1.1.7.5", heading: LCOC_CONTENT, indicator: "5. Written warnings issued.", options: YES_PARTLY_NO },
      { code: "1.1.7.6", heading: LCOC_CONTENT, indicator: "6. Notice for disciplinary hearings issued.", options: YES_PARTLY_NO },
      { code: "1.1.7.7", heading: LCOC_CONTENT, indicator: "7. The rights of the learner are explained.", options: YES_PARTLY_NO },
      { code: "1.1.7.8", heading: LCOC_CONTENT, indicator: "8. Support / Counselling measures available.", options: YES_PARTLY_NO },
      { code: "1.1.7.9", heading: LCOC_CONTENT, indicator: "9. There is a procedure for appeals.", options: YES_NO },
      {
        code: "1.1.7.10",
        heading: LCOC_CONTENT,
        indicator: "10. Suspension of a learner according to the procedures in SASA s9 (1,1A-E)",
        options: YES_PARTLY_NO,
      },
      {
        code: "1.1.8.1",
        heading: ECOC,
        indicator:
          "Educator conduct\nPrincipal maintains high visibility by:\n1. Walking around during contact time to ensure that time on task is taking place, to prevent loitering and vandalism, and that all staff members are productive.",
        options: ["ALWAYS", "OFTEN", "SOMETIMES", "SELDOM", "NEVER"],
      },
      {
        code: "1.1.8.2",
        heading: ECOC,
        indicator: "2. Taking time to talk informally with learners and educators during breaks.",
        options: ["ALWAYS", "OFTEN", "SOMETIMES", "SELDOM", "NEVER"],
      },
      {
        code: "1.1.8.3",
        heading: ECOC,
        indicator: "3. Visiting classrooms to discuss school issues with learners and educators or for informal lesson observations.",
        options: ["ALWAYS", "OFTEN", "SOMETIMES", "SELDOM", "NEVER"],
      },
      { code: "1.1.8.4", heading: ECOC, indicator: "4. Attending/participating in extra- and co-curricular activities.", options: YES_PARTLY_NO },
      {
        code: "1.1.8.5",
        heading: ECOC,
        indicator:
          "5. Addressing educators and learners individually in the office, in a professional manner if patterns of unbecoming behaviour have been identified or observed.",
        options: YES_PARTLY_NO,
      },
      {
        code: "1.1.9.1",
        heading: REGISTERS,
        indicator: "1. The time register is filled in correctly and monitored by the principal/ SMT member.",
        options: AVAILABILITY,
      },
      {
        code: "1.1.9.2",
        heading: REGISTERS,
        indicator: "2. Appropriate action taken where necessary - where register is not completed or late coming is problematic",
        options: FREQUENCY,
      },
      {
        code: "1.1.10.1",
        heading: "Educator leave records",
        indicator: "Educator Leave Control Measures:\n1. Percentage of educators who were absent during the previous term",
        options: ["LESS THAN 3%", "3 - 5%", "6 - 10%", "MORE THAN 10%"],
      },
      {
        code: "1.1.10.2",
        heading: "Educator leave records",
        indicator: "2. All educators leave forms are submitted for leave taken during the previous calendar month.",
        options: ["ALL", "MOST", "SOME", "NONE"],
      },
      {
        code: "1.1.11.1",
        heading: "Post establishment",
        indicator: "1. Educator vacancies are filled as soon as possible to ensure that there is a full staff complement at the school.",
        options: YES_PARTLY_NO,
      },
      {
        code: "1.1.11.2",
        heading: "Post establishment",
        indicator: "2. The number of vacancies has not been permanently filled in the past twelve months.",
        options: ["NONE", "1 - 2", "3 - 5", "MORE THAN 5"],
      },
      {
        code: "1.1.12.1",
        heading: "Year Plan",
        indicator:
          "All key events have been planned for and aligned with WCED administration planning calendar:\n- SIP Action plans\n- Class visits\n- Dates of assessments\n- Sport days\n- Extra and co-curricular events\n- Meeting dates for each phase and grade\n- Feedback sessions on implementation of new developments, etc.\n- One-on-one meetings between principal and departmental heads to track processes in each respective department.",
        options: [
          "AVAILABLE WITH ALL ASPECTS IN ORDER",
          "AVAILABLE WITH MAJORITY ASPECTS IN ORDER",
          "AVAILABLE WITH SOME ASPECTS IN ORDER",
          "NOT AVAILABLE",
        ],
      },
      {
        code: "1.1.13.1",
        heading: "Admission Policy and Admission Register",
        indicator: "1. Online admission process followed in accordance with the Admission Policy.",
        options: YES_PARTLY_NO,
      },
      { code: "1.1.13.2", heading: "Admission Policy and Admission Register", indicator: "2. Admission Register updated", options: YES_PARTLY_NO },
      {
        code: "1.1.14.1",
        heading: ADMIN_SYSTEMS,
        indicator: "1. Maintains a logbook recording important events.",
        options: ["FULL RECORDS KEPT", "PARTIAL RECORDS KEPT", "NO RECORDS KEPT"],
      },
      {
        code: "1.1.14.2",
        heading: ADMIN_SYSTEMS,
        indicator: "2. Effective system in place to manage all correspondence.",
        options: ["FULLY EFFECTIVE", "MOSTLY EFFECTIVE", "PARTLY EFFECTIVE", "NOT EFFECTIVE"],
      },
      {
        code: "1.1.14.3",
        heading: ADMIN_SYSTEMS,
        indicator: "3. Maintains a filing and storage system, including sensitive information",
        options: ["FULLY IN PLACE", "MOSTLY IN PLACE", "PARTLY IN PLACE", "NOT IN PLACE"],
      },
    ],
  },

  // =====================================================================
  {
    number: 2,
    title: "Leadership, Management and Communication",
    purpose: "To evaluate the effectiveness of the leadership and management of the school (to be done in conjunction with SMT workplans)",
    items: [
      {
        code: "2.1.1.1",
        heading: "The principal drives the goals that are outlined in the Mission and Vision Statements.",
        indicator:
          "The school has well defined Mission and Vision Statements which are current and provide the school with clear direction and motivation. All action plans are geared to achieve the Mission and Vision statements of the school.",
        options: [
          "FULLY IMPLEMENTED (MORE THAN 80%)",
          "SUBSTANTIALLY IMPLEMENTED (60% - 80%)",
          "PARTIALLY IMPLEMENTED (40% - 59%)",
          "NOT IMPLEMENTED (LESS THAN 40%)",
        ],
      },
      {
        code: "2.1.2.1",
        heading: SIP,
        indicator:
          "1. An annual School Improvement Plan (SIP) is developed. The SIP action plans are well integrated into the calendar and implemented. They include clear staff responsibilities to meet set targets and goals.",
        options: [
          "MORE THAN 80% OF SIP ACTIVITIES IMPLEMENTED",
          "BETWEEN 50% AND 80% OF SIP ACTIVITIES IMPLEMENTED",
          "LESS THAN 50% OF SIP ACTIVITIES IMPLEMENTED",
          "NO SIP AVAILABLE",
        ],
      },
      {
        code: "2.1.2.2",
        heading: SIP,
        indicator:
          "2. APIP: Subject Improvement Plans based on diagnostic reports of external and internal assessment results. Improved and creative strategies are devised to address common or repetitive shortcomings or challenges e.g. LoLT, poor literacy.",
        options: [
          "APIP ALIGNED - MORE THAN 80% IMPLEMENTED",
          "APIP ALIGNED - 50% TO 80% IMPLEMENTED",
          "APIP ALIGNED - LESS THAN 50% IMPLEMENTED",
          "NO APIP AVAILABLE",
        ],
      },
      {
        code: "2.1.2.3",
        heading: SIP,
        indicator:
          "3. The principal diarises appointments with key staff members (including committee leaders and grade heads) to discuss, support and track progress with implementation of SIP Action plans, including Subject Improvement Plans. Amendments and proposals are considered to ensure goals of the school are attained.",
        options: [
          "REGULAR AND SCHEDULED ONE-ON-ONE MEETINGS",
          "OCCASIONAL ONE-ON-ONE MEETINGS",
          "IRREGULAR MEETINGS",
          "NO MEETINGS",
        ],
      },
      {
        code: "2.1.3.1",
        heading:
          "Job Descriptions and Educator Duty Lists, including the Relief Timetable, in accordance with QMS performance standards, are well implemented. The principal and SMT manage conflict by ensuring that each staff member fulfills their work in accordance with their job descriptions. All parties are given opportunities to state their case, strategies are in place to address matters and they are not allowed to continue indefinitely. Measures are always in place to ensure that a positive working climate prevails in the school.",
        indicator:
          "A formal discussion is held with all staff members at least once a year regarding the link between their JDs and the performance standards, in accordance with their post levels. All tasks assigned to them (e.g. to implement SIP action plans) are opportunities to enhance their performance",
        options: implementation("DISCUSSIONS HELD WITH ALL STAFF", "DISCUSSIONS HELD WITH MOST STAFF", "DISCUSSIONS HELD WITH SOME STAFF", "NO DISCUSSIONS HELD"),
      },
      {
        code: "2.1.4.1",
        heading:
          "Planning is done, based on collected data of the school. Transparent decision-making structures and accountability (Based on consultations, engagements and feedback, creative decisions are made to be proactive and not reactive). Principal and SMT takes responsibility for decisions made. They provide leadership, mentoring, support and development. Schedule of principal one-on-one meetings with each member of SMT. The following are discussed and checked: Agendas: Curriculum monitoring plan, Feedback from class visits, educator performance, learner performance, impact of professional development on classroom practices, subject improvement progress.",
        indicator:
          "1. The principal monitors the work done by departmental heads and aligns the decisions made in meetings with classroom practices.\n2. Minutes of meetings and visitation rosters are submitted regularly and discussed to track progress.\n3. One-on-one discussions are held with each departmental head to track progress with implementation of subject improvement plans. Resources and agenda for discussions: Term results, Systemic evaluation results, NSC results, Subject advisor reports, Class visitation reports / PGPs, DBE diagnostic reports, Teachers planning - to illustrate that it is informed from above reports.",
        options: implementation("MONITORING CONSISTENT AND DOCUMENTED", "MONITORING REGULAR"),
      },
      {
        code: "2.1.5.1",
        heading:
          "The principal and SMT ensures that functional curriculum structures are in place. This is evident from the minutes of SMT meetings / subject meetings and staff meetings with decisions of actions plans, feedback of implemented plans, achievement of targets and review of action plans.",
        indicator:
          "1. Minutes of meetings and visitation rosters, which is part of the curriculum monitoring plan, are submitted regularly and discussed to track progress.\n2. Resources and agenda for discussions include: Term results, Systemic evaluation results, NSC results, Subject advisor reports, Class visitation reports / PGPs, DBE diagnostic reports, Teachers planning - to illustrate that it is informed from above reports.",
        options: implementation("STRUCTURES FULLY FUNCTIONAL", "STRUCTURES MOSTLY FUNCTIONAL"),
      },
      {
        code: "2.1.6.1",
        heading:
          "Promotes teacher appraisal practices. Performance Management (QMS), based on evidence from School's record files: Performance Management files (QMS and SPMDS), Educator personal files, Educator misconduct (Progressive Discipline) file, PS Staff personal files, PS Staff misconduct file, Signed JDs for all staff, Policy file (ELRC Agreements, Circulars, Acts), Correspondence, Internal Policy file, Learner profiles, Learner misconduct, Minutes of all operational structures within the school (SMT, SGB, SBST, SAIC, LTSM, RCL), LTS file",
        indicator:
          "Performance Management (QMS) is implemented on an ongoing basis in an informal and formal basis to guide, develop, support, monitor and affirm educators to motivate them to strive to improve their performance, to enhance the professional relationship between educators and the SMT.",
        options: implementation("ONGOING AND DOCUMENTED", "REGULAR"),
      },
      {
        code: "2.1.7.1",
        heading:
          "SA-SAMS/IT /Google platform Administration System / CEMIS information updated / uses technology in creative ways to help with the running of the school.",
        indicator: "Information Technology platforms used effectively in school administration and management.",
        options: implementation("EFFECTIVE AND INNOVATIVE", "EFFECTIVE", "BASIC USE", "NOT USED"),
      },
      {
        code: "2.1.8.1",
        heading: "Policies and effective administrative systems",
        indicator:
          "The principal delegates, manages and is accountable for ensuring that policies are updated regularly, and that all administrative processes are done well, e.g., the upload of the SIP, the updates on CEMIS, admissions are processed, leave forms submitted on time etc.",
        options: implementation("POLICIES CURRENT AND PROCESSES DONE WELL", "MOST POLICIES CURRENT", "SOME POLICIES CURRENT", "POLICIES OUTDATED"),
      },
      {
        code: "2.1.9.1",
        heading: OBSERVATIONS,
        indicator:
          "The principal and SMT's supervision and evaluation of instruction:\n1. Lesson observations, using QMS lesson observation instrument and in Quality of teaching and learning and educator development (QTL). Review learner work and teachers' classroom practices when evaluating classroom instruction.",
        options: implementation("CONDUCTED CONSISTENTLY", "CONDUCTED REGULARLY", "CONDUCTED OCCASIONALLY", "NOT CONDUCTED"),
      },
      {
        code: "2.1.9.2",
        heading: OBSERVATIONS,
        indicator:
          "2. Conduct informal observations in classrooms on a regular basis (informal observations are unscheduled, which last at least 5 minutes, and may or may not involve written or formal feedback)",
        options: implementation("CONDUCTED CONSISTENTLY", "CONDUCTED REGULARLY", "CONDUCTED OCCASIONALLY", "NOT CONDUCTED"),
      },
      {
        code: "2.1.9.3",
        heading: OBSERVATIONS,
        indicator:
          "3. Feedback: Point out specific strengths in educators' instructional practices in post-observation feedback (e.g. in discussions or written evaluations)",
        options: implementation("CONDUCTED CONSISTENTLY", "CONDUCTED REGULARLY", "CONDUCTED OCCASIONALLY", "NOT CONDUCTED"),
      },
      {
        code: "2.1.9.4",
        heading: OBSERVATIONS,
        indicator:
          "4. Feedback: Point out specific weaknesses in educators' instructional practices in post-observation feedback (e.g. in discussions or written evaluations)",
        options: implementation("CONDUCTED CONSISTENTLY", "CONDUCTED REGULARLY", "CONDUCTED OCCASIONALLY", "NOT CONDUCTED"),
      },
      {
        code: "2.1.9.5",
        heading: OBSERVATIONS,
        indicator: "5. Follow up done on recommendations to address weaknesses and to build on strengths.",
        options: implementation("CONDUCTED CONSISTENTLY", "CONDUCTED REGULARLY", "CONDUCTED OCCASIONALLY", "NOT CONDUCTED"),
      },
      {
        code: "2.1.10.1",
        heading:
          "Functional curriculum structures: Ensures that functional curriculum structures, in each phase and grade, are in place. Curriculum Management: implementation of Curriculum Framework that is aligned with Performance Management (QMS) and includes a Curriculum Monitoring plan.",
        indicator:
          "The SMT support, guides and monitors curriculum coverage. The template and/or google form are completed and updated regularly. The Departmental Heads utilize the curriculum coverage tools to ensure that the core skills in each subject are reinforced as a means of addressing learning losses.",
        options: PHASE_IMPLEMENTATION,
        parts: PHASES,
        partsLabel: "Phase",
      },
      {
        code: "2.1.11.1",
        heading:
          "Curriculum Management: Curriculum Monitoring plan, includes the use of the QMS lesson observation instrument in QTL. Each grade and phase head / Departmental Head reports to the principal during one-on-one meetings. Monitors marking and moderation of assessments.",
        indicator:
          "The SMT support, guides and monitors lesson planning, learner written work and assessment practices. The pitch of the assessments are indications of the range and level of teaching and learning.",
        options: PHASE_IMPLEMENTATION,
        parts: PHASES,
        partsLabel: "Phase",
      },
      {
        code: "2.1.12.1",
        heading: PROF_DEV,
        indicator:
          "Developing and empowering self and others\nThe Principal promotes educator's professional development by:\n1. Ensuring that in-service activities attended by staff are consistent with the school's goals. In-house training is also arranged as part of staff development initiatives.",
        options: implementation("COMPREHENSIVE IMPLEMENTATION", "REGULAR IMPLEMENTATION", "OCCASIONAL IMPLEMENTATION", "NO IMPLEMENTATION"),
      },
      {
        code: "2.1.12.2",
        heading: PROF_DEV,
        indicator:
          "2. Actively supporting the use in the classroom of skills acquired during in-service training (planning is amended by making notes of implementation of new learnings)",
        options: implementation("COMPREHENSIVE IMPLEMENTATION", "REGULAR IMPLEMENTATION", "OCCASIONAL IMPLEMENTATION", "NO IMPLEMENTATION"),
      },
      {
        code: "2.1.12.3",
        heading: PROF_DEV,
        indicator: "3. Obtaining the participation of the whole staff in important in-service activities.",
        options: implementation("COMPREHENSIVE IMPLEMENTATION", "REGULAR IMPLEMENTATION", "OCCASIONAL IMPLEMENTATION", "NO IMPLEMENTATION"),
      },
      {
        code: "2.1.12.4",
        heading: PROF_DEV,
        indicator: "4. Leading and/or attending educator in-service activities relating to curriculum delivery",
        options: implementation("COMPREHENSIVE IMPLEMENTATION", "REGULAR IMPLEMENTATION", "OCCASIONAL IMPLEMENTATION", "NO IMPLEMENTATION"),
      },
      {
        code: "2.1.12.5",
        heading: PROF_DEV,
        indicator:
          "5. Setting aside time at phase / grade / staff / subject meetings for educators to share ideas or to discuss information from in-service activities as well as for giving feedback from experimenting with innovations and/or new developments.",
        options: implementation("COMPREHENSIVE IMPLEMENTATION", "REGULAR IMPLEMENTATION", "OCCASIONAL IMPLEMENTATION", "NO IMPLEMENTATION"),
      },
      {
        code: "2.1.13.1",
        heading: LABOUR,
        indicator:
          "1. Principal affirm educators:\n1. Reinforces superior performance by educators in staff meetings, newsletters, and/or memos.\n2. Compliment educators privately for their efforts or performance.\n3. Create professional growth opportunities for educators as a reward for special contributions to the school.",
        options: implementation("PROCEDURES CONSISTENTLY FOLLOWED", "PROCEDURES MOSTLY FOLLOWED", "PROCEDURES SOMETIMES FOLLOWED", "PROCEDURES NOT FOLLOWED"),
      },
      {
        code: "2.1.13.2",
        heading: LABOUR,
        indicator:
          "2. The correct progressive discipline processes are followed to ensure that unprofessional conduct of educators is curbed and addressed immediately and not allowed to continue indefinitely.\n3. Disciplinary actions and grievances are addressed in accordance with relevant ELRC/PSCBC resolutions",
        options: implementation("PROCEDURES CONSISTENTLY FOLLOWED", "PROCEDURES MOSTLY FOLLOWED", "PROCEDURES SOMETIMES FOLLOWED", "PROCEDURES NOT FOLLOWED"),
      },
      {
        code: "2.1.14.1",
        heading:
          "Provides excellent leadership to improve learner performance: Analyse learner performance results to ensure that interventions are implemented. The impact of interventions is monitored with quarterly analyses of learner results. Interventions are reviewed, depending on learner results.",
        indicator:
          "Monitoring learner progress:\n1. Meet individually with educators to discuss learner progress\n2. Discuss academic performance results with the phase / grade / subject to identify curricular strengths and weaknesses.\n3. Use tests and other performance measures to assess progress toward school goals / targets.\n4. Inform educators of the school's performance results in written form (e.g. in a memo or newsletter).\n5. Inform learners of the school's academic progress.",
        options: implementation("MONITORING CONSISTENT AND DOCUMENTED", "MONITORING REGULAR"),
      },
      {
        code: "2.1.15.1",
        heading: "Communication",
        indicator:
          "Communication of goals\n1. The principal and SMT refer to the school's goals or mission in all forums with learners and educators. The principal conveys to all stakeholders how the school's plans and achievements are leading to attainment of significant elements of the Vision and Mission statements.",
        options: implementation("COMMUNICATION IS CONSISTENT AND EFFECTIVE", "COMMUNICATION IS REGULAR", "COMMUNICATION IS OCCASIONAL", "NO COMMUNICATION"),
      },
      {
        code: "2.1.15.2",
        heading: "Communication",
        indicator:
          "2. The school's academic goals are reflected in highly visible displays in the school (e.g. posters or bulletin boards emphasizing academic progress). The progress to achieve the goals are shared with staff and learners.",
        options: implementation("COMMUNICATION IS CONSISTENT AND EFFECTIVE", "COMMUNICATION IS REGULAR", "COMMUNICATION IS OCCASIONAL", "NO COMMUNICATION"),
      },
      {
        code: "2.1.15.3",
        heading: "Communication",
        indicator:
          "3. Ensures departmental circulars and other relevant information are brought to the attention of the staff. Effective mediation takes place so that all relevant staff are updated. Follow up processes are in place to ascertain level of implementation of the latest developments.",
        options: implementation("COMMUNICATION IS CONSISTENT AND EFFECTIVE", "COMMUNICATION IS REGULAR", "COMMUNICATION IS OCCASIONAL", "NO COMMUNICATION"),
      },
    ],
  },

  // =====================================================================
  {
    number: 4,
    title: "Quality of Teaching and Learning",
    purpose: "To evaluate the quality of teaching and learning and the extent to which the school provides and promotes educator development",
    items: [
      { code: "4.6.1.1", heading: "a) Curriculum Policy (CAPS) / Annual Teaching Plans / Curriculum Continuum", indicator: "", options: DOC_AVAILABLE },
      { code: "4.6.1.2", heading: "b) National Policy Pertaining to the Programme and Promotion Requirements", indicator: "", options: DOC_AVAILABLE },
      { code: "4.6.1.3", heading: "c) Curriculum Framework / ATPs", indicator: "", options: DOC_AVAILABLE },
      {
        code: "4.6.1.4",
        heading: "d) Curriculum Coverage Tool",
        indicator: "",
        options: ["FULLY UTILIZED", "PARTLY UTILIZED", "NOT UTILIZED"],
      },
      {
        code: "4.6.1.5",
        heading: "e) Subject Policies",
        indicator: "",
        options: [
          "ALL POLICIES AVAILABLE AND FULLY UPDATED",
          "MOST POLICIES AVAILABLE AND UPDATED",
          "SOME POLICIES AVAILABLE",
          "NOT AVAILABLE",
        ],
      },
      { code: "4.6.1.6", heading: "f) Assessment Policy", indicator: "", options: DOC_UPDATED },
      { code: "4.6.1.7", heading: "g) Moderation Policy", indicator: "", options: DOC_UPDATED },
      { code: "4.6.1.8", heading: "h) School Based Support Team (SBST): Minutes, records of support and progress", indicator: "", options: DOC_UPDATED },
      { code: "4.6.1.9", heading: "i) QMS Documentation", indicator: "", options: DOC_UPDATED },
      {
        code: "4.6.1.10",
        heading: "j) Staff Development Policy with record of Continuous Professional Development (CPTD) points of educators",
        indicator: "",
        options: DOC_UPDATED,
      },
      {
        code: "4.6.1.11",
        heading: "k) Annual Academic Performance Improvement Plan (APIP): Subject Improvement Plans, which forms part of SIP",
        indicator: "",
        options: ["APIP AVAILABLE, ALIGNED TO SIP", "APIP AVAILABLE, NOT ALIGNED TO SIP", "NOT AVAILABLE"],
      },
      {
        code: "4.1.1.1",
        heading: LT_ENVIRONMENT,
        indicator: "1. Percentage of classrooms where seating arrangements promote effective teaching and learning",
        options: CLASSROOM_PERCENT,
      },
      { code: "4.1.1.2", heading: LT_ENVIRONMENT, indicator: "2. Percentage of classrooms that are tidy and clean", options: CLASSROOM_PERCENT },
      {
        code: "4.1.1.3",
        heading: LT_ENVIRONMENT,
        indicator:
          "3. Percentage of classrooms where teaching and learning support material (e.g. charts, e-Learning resources) are displayed and well utilised in the classroom, to bring lessons alive / to make lessons interesting and/or relevant to their lives.",
        options: PERCENT_BANDS,
      },
      { code: "4.1.2.1", heading: CLASS_MANAGEMENT, indicator: "1. Percentage of educators who are punctual and organized in class", options: PERCENT_BANDS },
      {
        code: "4.1.2.2",
        heading: CLASS_MANAGEMENT,
        indicator: "2. Percentage of educators who ensure that learners are punctual and settle down quickly",
        options: PERCENT_BANDS,
      },
      {
        code: "4.1.2.3",
        heading: CLASS_MANAGEMENT,
        indicator:
          "3. Percentage of class groups where it is evident that communication between educators and learners reflects mutual respect, cooperation and understanding",
        options: PERCENT_BANDS,
      },
      { code: "4.1.2.4", heading: CLASS_MANAGEMENT, indicator: "4. Percentage of educators who manage discipline effectively", options: PERCENT_BANDS },
      {
        code: "4.2.1.1",
        heading: SUBJECT_KNOWLEDGE,
        indicator: "1. Percentage of educators who have adequate subject knowledge and use it effectively",
        options: PERCENT_BANDS,
        parts: PHASES,
        partsLabel: "Phase",
      },
      {
        code: "4.2.1.2",
        heading: SUBJECT_KNOWLEDGE,
        indicator: "2. Percentage of educators who set appropriate tasks for learners at the level of the grade",
        options: PERCENT_BANDS,
        parts: PHASES,
        partsLabel: "Phase",
      },
      {
        code: "4.2.1.3",
        heading: SUBJECT_KNOWLEDGE,
        indicator: "3. Percentage of educators who use a variety of examples, LTSM and other teaching resources to facilitate learning",
        options: PERCENT_BANDS,
        parts: PHASES,
        partsLabel: "Phase",
      },
      {
        code: "4.2.1.4",
        heading: SUBJECT_KNOWLEDGE,
        indicator: "4. Percentage of educators who attend and participate in activities to enhance their professional and teaching skills.",
        options: PERCENT_BANDS,
      },
      {
        code: "4.2.1.5",
        heading: SUBJECT_KNOWLEDGE,
        indicator: "5. Learners' assessment results reflect the use of creative teaching strategies, which come from educators' ongoing development.",
        options: [
          "LEARNER PERFORMANCE REFLECTS THIS STRONGLY",
          "LEARNER PERFORMANCE REFLECTS THIS",
          "LEARNER PERFORMANCE PARTLY REFLECTS THIS",
          "LEARNER PERFORMANCE DOES NOT REFLECT THIS",
        ],
      },
      {
        code: "4.2.2.1",
        heading: PLANNING,
        indicator:
          "1. Lessons are logical, coherent and meaningful to learners\n2. Lessons are built on past knowledge and experience of learners\n3. Time is well managed during lesson presentations",
        options: [
          "MORE THAN 80% OF LESSONS ADHERE TO THIS",
          "LESS THAN 80% OF LESSONS ADHERE TO THIS",
          "LESS THAN 60% OF LESSONS ADHERE TO THIS",
          "LESS THAN 40% OF LESSONS ADHERE TO THIS",
        ],
      },
      {
        code: "4.2.2.2",
        heading: PLANNING,
        indicator:
          "4. Encourages interactive learning, including class discussions, learner questions and demonstrations.\n5. Responds appropriately to learner questions and inputs.",
        options: [
          "MORE THAN 80% OF LESSONS ALLOW FOR THIS",
          "LESS THAN 80% OF LESSONS ALLOW FOR THIS",
          "LESS THAN 60% OF LESSONS ALLOW FOR THIS",
          "LESS THAN 40% OF LESSONS ALLOW FOR THIS",
        ],
      },
      {
        code: "4.2.3.1",
        heading: WORK_SCHEDULE,
        indicator: "1. Pace of the work is in line with time frames stipulated in the work schedule",
        options: YES_PARTLY_NO,
      },
      { code: "4.2.3.2", heading: WORK_SCHEDULE, indicator: "2. Number of tasks and activities are in line with ATPs in CAPS", options: YES_PARTLY_NO },
      {
        code: "4.2.4.1",
        heading: RECORD_KEEPING,
        indicator:
          "Files are neatly kept, organized and updated regularly, including notes on training and development sessions that are being implemented in the classroom.",
        options: ["ORGANIZED AND HAS ADDITIONAL RESOURCES", "ORGANIZED AND UPDATED", "PARTLY ORGANIZED", "NOT ORGANIZED"],
      },
      {
        code: "4.2.4.2",
        heading: RECORD_KEEPING,
        indicator:
          "Records of learner assessments are neatly kept, organized and updated regularly. Evidence of the analyses of results is shown (e.g. highlighting trends and making notes of identified shortcomings) to inform planning (lessons and assessments).",
        options: ["NEAT WITH EVIDENCE OF ANALYSES", "NEAT WITH LIMITED ANALYSES", "NEAT WITHOUT ANALYSES", "NOT ORGANIZED"],
      },
      {
        code: "4.3.1.1",
        heading: FEEDBACK,
        indicator: "1. Assessment tasks are marked and returned to learners timeously",
        options: ["MARKED AND RETURNED TIMEOUSLY", "MARKED AND RETURNED WITH SOME DELAYS", "MARKED BUT NOT RETURNED TIMEOUSLY", "NOT MARKED"],
      },
      {
        code: "4.3.1.2",
        heading: FEEDBACK,
        indicator: "2. Feedback is meaningful and regular.",
        options: ["ALWAYS USED EFFECTIVELY", "USED MOST OF THE TIME", "SOMETIMES USED", "NOT USED"],
      },
      {
        code: "4.3.1.3",
        heading: FEEDBACK,
        indicator: "3. Feedback is incorporated in future lesson planning",
        options: ["ALWAYS USED EFFECTIVELY", "USED MOST OF THE TIME", "SOMETIMES USED", "NOT USED"],
      },
      {
        code: "4.3.2.1",
        heading: ASSESSMENT_FORMS,
        indicator: "1. Uses different forms of assessment in line with CAPS to test learner performance.",
        options: ["EXTENDED USE OF ASSESSMENTS", "ADEQUATE USE OF ASSESSMENTS", "LIMITED USE OF ASSESSMENTS", "NO VARIETY OF ASSESSMENTS"],
      },
      {
        code: "4.3.2.2",
        heading: ASSESSMENT_FORMS,
        indicator: "2. Intervention strategies accommodate learners with various learning abilities",
        options: ["EXTENDED INTERVENTIONS", "ADEQUATE INTERVENTIONS", "LIMITED INTERVENTIONS", "NO INTERVENTIONS"],
      },
      {
        code: "4.3.2.3",
        heading: ASSESSMENT_FORMS,
        indicator:
          "3. Assessment tasks are moderated in accordance with Moderation Policy. There is evidence of pre- and post-moderation to ensure that the standard and level of assessment are appropriate for the grade.",
        options: [
          "MODERATION COMPREHENSIVE WITH EVIDENCE",
          "MODERATION DONE WITH SOME EVIDENCE",
          "MODERATION DONE WITHOUT EVIDENCE",
          "NO MODERATION",
        ],
      },
      {
        code: "4.3.3.1",
        heading: LEARNER_PROGRESS,
        indicator: "1. Learner results of various forms of assessment show that they are attaining the set outcomes",
        options: ["HIGH", "AVERAGE", "LOW"],
      },
      {
        code: "4.3.3.2",
        heading: LEARNER_PROGRESS,
        indicator: "2. Remedial / Enrichment work / co-curricular activities support learner progress.",
        options: ["HIGH", "AVERAGE", "LOW"],
      },
      {
        code: "4.4.1.1",
        heading: LEARNER_WORK,
        indicator: "Learners' classwork books reflect the range of work required in the Annual Teaching Plans (ATPs)",
        options: LEARNER_WORK_PERCENT,
      },
      { code: "4.4.1.2", heading: LEARNER_WORK, indicator: "Learner classwork books indicate that corrections are being done.", options: LEARNER_WORK_PERCENT },
      {
        code: "4.4.1.3",
        heading: LEARNER_WORK,
        indicator: "Educators control/mark the written work of learners regularly with specific feedback to improve their performance.",
        options: LEARNER_WORK_PERCENT,
      },
      {
        code: "4.4.1.4",
        heading: LEARNER_WORK,
        indicator:
          "Curriculum coverage: The planning, learners work, and assessments are aligned with ATPs. Curriculum Coverage templates are updated in accordance with departmental requirements.",
        options: LEARNER_WORK_PERCENT,
      },
      {
        code: "4.5.1.1",
        heading: SBST,
        indicator:
          "The school has a functional School Based Support Team (SBST) in place. Each teacher's strategy to support learners in class and the input of the SBST is assessed.",
        options: ["HIGH FUNCTIONING", "FUNCTIONING", "PARTLY FUNCTIONING", "NOT FUNCTIONING"],
      },
      {
        code: "4.5.1.2",
        heading: SBST,
        indicator: "The school has a process to identify learners with barriers to learning.",
        options: ["HIGHLY FUNCTIONAL", "FUNCTIONAL", "PARTLY FUNCTIONAL", "NOT FUNCTIONAL"],
      },
      {
        code: "4.5.1.3",
        heading: SBST,
        indicator:
          "Learners with barriers to learning are provided with focused support. Teachers use innovative practices to assist learners with barriers to learning, during lessons.",
        options: ["ALL", "MOST", "SOME", "NONE"],
      },
      {
        code: "4.5.1.4",
        heading: SBST,
        indicator: "Interventions are well implemented to improve learner performance.",
        options: ["VERY WELL", "WELL", "PARTLY", "NOT AT ALL"],
      },
    ],
  },

  // =====================================================================
  {
    number: 5,
    title: "Curriculum Provision and Resources",
    purpose:
      "To evaluate the implementation of the curriculum and enrichment programs offered at schools and to what extent it enhances the aims and objectives of the education system.\nThe SMT promotes quality of teaching and learning through effective resource management: Administration of resources and records (reporting to be done in accordance with phases to identify key areas that require improvement)",
    items: [
      {
        code: "5.1.1.1",
        heading: LTSM,
        indicator: "LTSM committee:\nEnsure effective implementation of LTSM Policy.",
        options: ["POLICY REVIEWED/ UPDATED THIS YEAR", "POLICY REVIEWED IN THE LAST 3 YEARS", "POLICY OUTDATED", "NO POLICY"],
      },
      {
        code: "5.1.1.2",
        heading: LTSM,
        indicator: "Review of textbooks and online resources to ensure that the school is always updated",
        options: [
          "RESOURCES REVIEWED/ UPDATED THIS YEAR",
          "RESOURCES REVIEWED IN THE LAST 3 YEARS",
          "RESOURCES OUTDATED",
          "NO REVIEW DONE",
        ],
      },
      {
        code: "5.1.1.3",
        heading: LTSM,
        indicator: "Ensure parents and learners sign acknowledgement of textbooks issued",
        options: ["FULL EVIDENCE", "SOME EVIDENCE", "NO EVIDENCE"],
      },
      { code: "5.1.1.4", heading: LTSM, indicator: "Ensure accurate class lists are kept for textbooks issued", options: ["FULL EVIDENCE", "SOME EVIDENCE", "NO EVIDENCE"] },
      {
        code: "5.1.1.5",
        heading: LTSM,
        indicator: "Storage facilities are neat and obsolete books are disposed of correctly.",
        options: ["FULL MINUTES OF MEETINGS", "SOME MINUTES OF MEETINGS", "NO MINUTES OF MEETINGS"],
      },
      {
        code: "5.1.1.6",
        heading: LTSM,
        indicator: "CEMIS records of distribution and retrieval updated and accurate.",
        options: ["FULL RECORDS", "PARTIAL RECORDS", "NO RECORDS"],
      },
      {
        code: "5.1.1.7",
        heading: LTSM,
        indicator: "Regular audit reports provided to principal",
        options: ["FULL EVIDENCE OF REPORTS", "SOME EVIDENCE OF REPORTS", "NO EVIDENCE OF REPORTS"],
      },
      {
        code: "5.1.2.1",
        heading: "LTSM",
        indicator: "Textbooks are distributed or made available during lessons. This includes e-copies of textbooks.",
        options: [
          "80 - 100% OF LEARNERS HAVE ACCESS",
          "60 - 79% OF LEARNERS HAVE ACCESS",
          "40 - 59% OF LEARNERS HAVE ACCESS",
          "LESS THAN 40% OF LEARNERS HAVE ACCESS",
        ],
      },
      {
        code: "5.1.3.1",
        heading: "",
        indicator:
          "Effective measures are in place to retrieve all textbooks to reduce losses. Records are updated and LTSM Policy implemented to replace lost or damaged books.",
        options: [
          "MORE THAN 90% OF BOOKS RETRIEVED",
          "80 - 90% OF BOOKS RETRIEVED",
          "60 - 79% OF BOOKS RETRIEVED",
          "LESS THAN 60% OF BOOKS RETRIEVED",
        ],
      },
      {
        code: "5.1.4.1",
        heading: "",
        indicator:
          "The SMT manages the maintenance of equipment efficiently. Computers used by learners and other eLearning and laboratory resources. Asset Registers are updated: (furniture, teaching material, stationery and office requisites, media collections, ICT). Physical education resources and teaching aids.",
        options: [
          "ASSET REGISTER COMPREHENSIVELY UPDATED",
          "ASSET REGISTER PARTLY UPDATED",
          "ASSET REGISTER OUTDATED",
          "NO ASSET REGISTER",
        ],
      },
      {
        code: "5.1.5.1",
        heading: "",
        indicator:
          "Obsolete textbooks, broken furniture and equipment are disposed in an environmentally friendly manner or repurposed for the benefit of the school. Potential health hazards are identified and addressed immediately. Clutter is removed from the school premises.",
        options: ["DISPOSAL - 80 - 100%", "DISPOSAL - 60 - 79%", "DISPOSAL - 40 - 59%", "DISPOSAL - LESS THAN 40%"],
      },
      {
        code: "5.1.6.1",
        heading: "Oversees organization of extra-curricular activities",
        indicator:
          "Learners are supported in a variety of extra-curricular activities. Measures are in place to encourage and involve learners in extra-curricular activities.",
        options: [
          "MORE THAN 70 - 100% OF LEARNERS ARE INVOLVED",
          "50 - 69% OF LEARNERS ARE INVOLVED",
          "30 - 49% OF LEARNERS ARE INVOLVED",
          "LESS THAN 30% OF LEARNERS ARE INVOLVED",
        ],
      },
      {
        code: "5.1.7.1",
        heading: "Encourages well planned co-curricular activities, to enhance the delivery of the curriculum.",
        indicator: "Educator staff involved in extra mural and extra-curricular activities",
        options: [
          "MORE THAN 80% OF STAFF ACTIVELY INVOLVED",
          "60 - 80% OF STAFF ACTIVELY INVOLVED",
          "40 - 59% OF STAFF ACTIVELY INVOLVED",
          "LESS THAN 40% OF STAFF ACTIVELY INVOLVED",
        ],
      },
    ],
  },

  // =====================================================================
  {
    number: 6,
    title: "Governance and Relationships",
    purpose:
      "To evaluate the effectiveness of the governing body in fulfilling its roles and responsibilities regarding the establishment of a purposeful and disciplined school environment as well as management of resources.",
    items: [
      { code: "6.1.1.1", heading: "School Governing Body (SGB) Constitution", indicator: "", options: AVAILABILITY },
      { code: "6.1.1.2", heading: "Code of Conduct for the SGB members", indicator: "", options: AVAILABILITY },
      { code: "6.1.1.3", heading: "Minutes and agenda of SGB meetings", indicator: "", options: AVAILABILITY },
      { code: "6.1.1.4", heading: "Minutes of Annual General Meeting", indicator: "", options: AVAILABILITY },
      { code: "6.1.1.5", heading: "School Development Plan", indicator: "", options: AVAILABILITY },
      { code: "6.1.1.6", heading: "Human Resources - shortlisting & interview records", indicator: "", options: AVAILABILITY },
      { code: "6.1.1.7", heading: "Procurement records", indicator: "", options: AVAILABILITY },
      { code: "6.1.1.8", heading: "Stock register / inventory list", indicator: "", options: AVAILABILITY },
      { code: "6.1.1.9", heading: "Language Policy", indicator: "", options: AVAILABILITY },
      { code: "6.1.1.10", heading: "Policy on religion", indicator: "", options: AVAILABILITY },
      { code: "6.2.1.1", heading: SGB, indicator: "The stakeholder composition of the SGB is in line with legislation.", options: YES_NO },
      {
        code: "6.2.1.2",
        heading: SGB,
        indicator:
          "Number of formal SGB meetings held in the previous four quarters. (This refers to general meetings, excluding R&S and DC processes)",
        options: ["MORE THAN 1 MEETING PER TERM", "1 MEETING PER TERM", "LESS THAN 1 MEETING PER TERM", "NO MEETINGS"],
      },
      {
        code: "6.2.1.3",
        heading: SGB,
        indicator:
          "The members of the SGB have undergone relevant training. (Rating dependent on whether the members are suitably capacitated to perform expected functions.)",
        options: YES_PARTLY_NO,
      },
      {
        code: "6.2.1.4",
        heading: SGB,
        indicator: "Appropriate records of meetings are maintained by the SGB and its committees.",
        options: YES_PARTLY_NO,
      },
      {
        code: "6.2.2.1",
        heading: FINANCE,
        indicator: "Procedures as per the Financial Directives Manual for collecting and receiving money and banking are implemented.",
        options: YES_PARTLY_NO,
      },
      { code: "6.2.2.2", heading: FINANCE, indicator: "Proper practices for payments are followed.", options: YES_PARTLY_NO },
      { code: "6.2.2.3", heading: FINANCE, indicator: "Petty Cash is managed in a proper manner.", options: YES_PARTLY_NO },
      {
        code: "6.2.2.4",
        heading: FINANCE,
        indicator: "Processes as per the Financial Directives Manual followed to approve the budget for the current year",
        options: YES_PARTLY_NO,
      },
      { code: "6.2.2.5", heading: FINANCE, indicator: "The budget contains the appropriate income and expenditure items.", options: YES_PARTLY_NO },
      { code: "6.2.2.6", heading: FINANCE, indicator: "Audited Financial Statements available for the previous financial year.", options: YES_NO },
      {
        code: "6.2.3.1",
        heading: ASSETS,
        indicator: "Procurement procedures as per the Financial Directives Manual are practiced.",
        options: YES_PARTLY_NO,
      },
      {
        code: "6.2.3.2",
        heading: ASSETS,
        indicator: "Asset management procedures as per the Financial Directives Manual are practiced.",
        options: YES_PARTLY_NO,
      },
      { code: "6.2.4.1", heading: HR, indicator: "The SGB ensures due process in interviewing and selection of staff.", options: YES_PARTLY_NO },
      {
        code: "6.2.4.2",
        heading: HR,
        indicator: "The SGB ensures that school employed staff are remunerated in compliance with legislation.",
        options: YES_PARTLY_NO,
      },
    ],
  },

  // =====================================================================
  {
    number: 7,
    title: "School Safety and Security",
    purpose:
      "To evaluate the level at which the school provides for a healthy, safe and secure environment for learners, staff, parents and others",
    items: [
      {
        code: "7.2.1.1",
        heading: "Learner care: There is supervision of learners.",
        indicator: "Before school starts",
        options: FREQUENCY,
      },
    ],
  },

  // =====================================================================
  {
    number: 8,
    title: "School Infrastructure",
    purpose: "To evaluate to what extent the school has sufficient and appropriate infrastructure and how it is maintained",
    items: [
      { code: "8.1.1.1", heading: "Maintenance Policy", indicator: "", options: UPDATE_STATUS },
      { code: "8.1.1.2", heading: "Furniture", indicator: "", options: CONDITION },
      { code: "8.1.1.3", heading: "Staffroom", indicator: "", options: CONDITION },
      { code: "8.1.1.4", heading: "Offices for SMT (where applicable)", indicator: "", options: CONDITION },
      { code: "8.1.1.5", heading: "Office for Admin Clerk (where applicable)", indicator: "", options: CONDITION },
      { code: "8.1.1.6", heading: "Science laboratory (where applicable)", indicator: "", options: CONDITION },
      { code: "8.1.1.7", heading: "Library (where applicable)", indicator: "", options: CONDITION },
      { code: "8.1.1.8", heading: "Computer room (where applicable)", indicator: "", options: CONDITION },
      { code: "8.1.1.9", heading: "Accessibility to people with physical disabilities (where applicable)", indicator: "", options: CONDITION },
      { code: "8.1.1.10", heading: "Nutrition serving area (where applicable)", indicator: "", options: CONDITION },
      { code: "8.1.1.11", heading: "Sick bay", indicator: "", options: CONDITION },
      { code: "8.1.1.12", heading: "Sporting Facilities (where applicable)", indicator: "", options: CONDITION },
      {
        code: "8.2.1.1",
        heading: "School buildings, ablution facilities and grounds are properly maintained.",
        indicator:
          "1. Uses existing resources and physical infrastructure optimally. Certain facilities / venues are utilized for multiple uses.\n2. The principal and /or deputy principal monitors safekeeping of all immovable and movable assets. Audit reports are discussed and a follow up done to ensure effective utilization and safekeeping of all assets.",
        options: ["FULLY CONDUCTED", "PARTLY CONDUCTED", "NOT CONDUCTED"],
      },
      { code: "8.2.2.1", heading: BASIC_SERVICES, indicator: "The school has reliable water supply.", options: YES_NO },
      { code: "8.2.2.2", heading: BASIC_SERVICES, indicator: "The school has functional electrical supply.", options: YES_NO },
      {
        code: "8.2.2.3",
        heading: BASIC_SERVICES,
        indicator: "The ablution facilities at the school are appropriate, sufficient and in working order.",
        options: CONDITION,
      },
      { code: "8.2.3.1", heading: "Classrooms", indicator: "Classroom accommodation is sufficient and appropriately utilized.", options: CONDITION },
      { code: "8.2.4.1", heading: TERRAIN_MAINTENANCE, indicator: "The school has appropriate grounds.", options: YES_NO },
      {
        code: "8.3.4.1",
        heading: TERRAIN_MAINTENANCE,
        indicator:
          "1. The school implements initiatives to protect, clean and maintain infrastructure. The principal and /or deputy principal make regular infrastructure inspections to monitor implementation of Maintenance Policy.",
        options: CONDITION,
        parts: TERRAIN,
        partsLabel: "Terrain",
      },
      {
        code: "8.3.4.2",
        heading: TERRAIN_MAINTENANCE,
        indicator:
          "2. PS Staff have a schedule / timetable to ensure that all aspects of infrastructure are well maintained. The implementation of the schedule / timetable is monitored.",
        options: ["FULL PLAN/ REGULAR MONITORING", "PLAN AVAILABLE/ IRREGULAR MONITORING", "NO PLAN/ NO MONITORING"],
      },
      {
        code: "8.3.4.3",
        heading: TERRAIN_MAINTENANCE,
        indicator: "3. Initiatives are taken immediately to address problem areas before they worsen.",
        options: ["FULLY SCHEDULED", "PARTLY SCHEDULED", "NOT SCHEDULED"],
      },
      {
        code: "8.3.4.4",
        heading: TERRAIN_MAINTENANCE,
        indicator: "4. Community buy-in is sought to protect the school's assets.",
        options: ["WELL-UTILIZED", "PARTLY UTILIZED", "NOT UTILIZED"],
      },
    ],
  },

  // =====================================================================
  {
    number: 9,
    title: "Parents and Community",
    purpose:
      "To evaluate the extent to which the school encourages parental and community involvement in the education of the learners and how it makes use of their contributions to support learners' progress",
    items: [
      { code: "9.1.1.1", heading: "Notice, agenda and minutes of parent meetings", indicator: "", options: UPDATE_STATUS },
      { code: "9.1.1.2", heading: "Attendance register of parent meetings", indicator: "", options: UPDATE_STATUS },
      { code: "9.1.1.3", heading: "Correspondence to parents (Letters, Newsletters, diaries, emails and SMS)", indicator: "", options: REGULARITY },
      { code: "9.1.1.4", heading: "Minutes of Grade, Phase, Subject meetings", indicator: "", options: UPDATE_STATUS },
      { code: "9.1.1.5", heading: "Parent acknowledgement of the academic work of learners", indicator: "", options: REGULARITY },
      { code: "9.1.1.6", heading: "Correspondence pertaining to partnerships with the community", indicator: "", options: YES_NO },
      { code: "9.1.1.7", heading: "Acknowledgement of progress reports of learners by parents", indicator: "", options: REGULARITY },
      {
        code: "9.2.2.1",
        heading: "Parental involvement",
        indicator: "The school communicates once a quarter with parents on general school matters.",
        options: YES_NO,
      },
      {
        code: "9.2.2.2",
        heading: "Parental involvement",
        indicator: "The school engages parents on curriculum matters. (Not progress reports)",
        options: ["MONTHLY", "QUARTERLY", "ONCE A YEAR", "NEVER"],
      },
      {
        code: "9.2.2.3",
        heading: "Parental involvement",
        indicator: "Parents are involved in school activities:",
        options: ["MORE THAN 80%", "MORE THAN 60%", "LESS THAN 60%", "LESS THAN 30%"],
      },
      {
        code: "9.2.2.4",
        heading: "Links with community",
        indicator: "The school uses local services to benefit the school and learners.",
        options: ["MORE THAN 80% OF THE TIME", "MORE THAN 60% OF THE TIME", "LESS THAN 60% OF THE TIME", "NEVER"],
      },
    ],
  },
];
