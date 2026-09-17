import fs from 'node:fs';
import vm from 'node:vm';
export function readProfile() {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('./dist/content.js', import.meta.url), 'utf8'), sandbox);
  const data = JSON.parse(JSON.stringify(sandbox.window.PORTFOLIO));
  return {
    name: 'Carl Joseph D. Aguas',
    summary: 'Fourth-year Bachelor of Science in Information Technology student with hands-on experience developing academic projects involving software, web, databases, cloud, and IoT solutions. Committed to continuous learning and strengthening technical and problem-solving skills.',
    education: { schoolAsWrittenInResume: 'Philippines Christian University', degree: 'Bachelor of Science in Information Technology', period: '2022–present', expectedGraduation: 2027, seniorHigh: 'STEM, 2020–2022', honors: ['Dean’s Lister, AY 2024–2025', 'Dean’s Lister, AY 2025–2026'] },
    contact: { email: 'carljoseph.aguas@gmail.com', phoneAsWrittenInResume: '63+9452874381', address: '11 B Leonardo St. Pasay City' },
    seminars: ['Building the Future: Real-World Tools for IT and CS Students (May 2025)', 'Blockchain Summit (November 2025)', 'Responsible Use of AI in Education (March 2026)'],
    skills: data.skills,
    projects: data.projects.map(({image,images,...p})=>p),
    certificates: data.certificates.map(({image,...c})=>c),
    personal: data.personal,
    notes: 'Technical Support Fundamentals (Google) and Designing for User Experience (Microsoft) are ongoing courses, not earned certifications. The Blockchain Summit certificate is unavailable. Do not claim completion, issue dates, or verified credentials for these entries. Availability is unknown. Reading and playing were supplied as hobbies without further detail. Development roles were mentioned without a specific specialization. No employment history, favorite books, games, or character references are provided.'
  };
}
