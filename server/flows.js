export const qualificationQuestions = [
  { key: 'name', text: 'Enchant? ! Comment vous appelez-vous ?' },
  { key: 'company', text: 'Quelle est le nom de votre entreprise ?' },
  { key: 'role', text: 'Quel est votre r?le dans l?entreprise ?' },
  { key: 'need', text: 'Pouvez-vous d?crire votre besoin principal en 1-2 phrases ?' },
  { key: 'budget', text: 'Quel budget approximatif avez-vous pr?vu ? (fourchette)' },
  { key: 'timeline', text: 'Quel est votre d?lai id?al pour d?marrer ?' },
  { key: 'decision_maker', text: '?tes-vous le d?cisionnaire ? Si non, qui l?est ?' },
  { key: 'email', text: 'Quelle est votre adresse e-mail pour le r?capitulatif ?' }
];

export function scoreLead(answers) {
  let score = 0;
  if (answers.need) score += 2;
  if (answers.budget) score += 2;
  if (answers.timeline) score += 1;
  if (answers.decision_maker && /oui|yes/i.test(answers.decision_maker)) score += 2;
  if (answers.role) score += 1;
  return score; // 0-8
}

export function buildSummary(answers) {
  const lines = [
    'R?capitulatif:',
    `- Nom: ${answers.name || '?'}`,
    `- Entreprise: ${answers.company || '?'}`,
    `- R?le: ${answers.role || '?'}`,
    `- Besoin: ${answers.need || '?'}`,
    `- Budget: ${answers.budget || '?'}`,
    `- D?lai: ${answers.timeline || '?'}`,
    `- D?cisionnaire: ${answers.decision_maker || '?'}`,
    `- Email: ${answers.email || '?'}`
  ];
  return lines.join('\n');
}

export function nextQuestion(stepIndex) {
  return qualificationQuestions[stepIndex] || null;
}
