import { getSession, saveSession, clearSession } from './sessionStore';
import { nextQuestion, scoreLead, buildSummary } from './flows';
import { generateObjectionHandling } from './llm';

const CLOSING_THRESHOLD = 5; // heuristic on 0-8 scale

function isEnding(text) {
  return /merci|parfait|c'est bon|ok merci/i.test(text);
}

function isAffirmation(text) {
  return /oui|ok|d'accord|let's go|go/i.test(text);
}

export async function handleIncomingMessage(userId, text) {
  let session = await getSession(userId);

  if (session.state === 'welcome') {
    session.state = 'qualifying';
    session.stepIndex = 0;
    await saveSession(userId, session);
    const q = nextQuestion(session.stepIndex);
    return { reply: `Bonjour ??\nJe vais vous poser quelques questions pour bien comprendre votre besoin.\n${q.text}` };
  }

  if (session.state === 'qualifying') {
    const currentQ = nextQuestion(session.stepIndex);
    if (currentQ) {
      session.answers[currentQ.key] = text;
      session.stepIndex += 1;
      const nextQ = nextQuestion(session.stepIndex);
      if (nextQ) {
        await saveSession(userId, session);
        return { reply: nextQ.text };
      }
      // Finished questions
      const leadScore = scoreLead(session.answers);
      session.state = leadScore >= CLOSING_THRESHOLD ? 'closing' : 'nurture';
      await saveSession(userId, session);
      const summary = buildSummary(session.answers);
      if (session.state === 'closing') {
        return { reply: `${summary}\n\nSuper, cela semble pertinent. Souhaitez-vous r?server un cr?neau pour finaliser ensemble ? R?pondez \"Oui\" pour recevoir un lien de r?servation.` };
      }
      return { reply: `${summary}\n\nMerci pour ces informations. Un expert va revenir vers vous sous peu. Souhaitez-vous ?tre recontact? par e-mail ou t?l?phone ?` };
    }
  }

  if (session.state === 'closing') {
    if (isAffirmation(text)) {
      session.state = 'done';
      await saveSession(userId, session);
      // In a real app, put your Calendly/booking link here
      const bookingLink = process.env.BOOKING_LINK || 'https://cal.com';
      return { reply: `Parfait ! Voici le lien pour r?server un cr?neau: ${bookingLink}\nJe reste disponible si besoin.` };
    }
    const llm = await generateObjectionHandling(`Prospect: ${text}`);
    if (llm) return { reply: llm };
    return { reply: `Je comprends. Qu?est-ce qui vous bloque le plus ? ce stade ? Budget, timing, ou autre ?` };
  }

  if (session.state === 'nurture') {
    if (isEnding(text)) {
      await clearSession(userId);
      return { reply: 'Merci pour cet ?change. Tr?s belle journ?e !' };
    }
    return { reply: `Merci ! Souhaitez-vous ?tre recontact? par e-mail ou t?l?phone ?` };
  }

  if (session.state === 'done') {
    if (/recommencer|restart|nouveau/i.test(text)) {
      await clearSession(userId);
      return { reply: 'Repartons de z?ro. Dites "Bonjour" pour commencer.' };
    }
    return { reply: 'Votre r?servation est en cours. Dites "Recommencer" pour une nouvelle qualification.' };
  }

  return { reply: 'Pouvez-vous reformuler ?' };
}
