import { getKey, setKey, delKey } from './redis';

const SESSION_PREFIX = 'wa_session:';

export async function getSession(userId) {
  const session = await getKey(SESSION_PREFIX + userId);
  return session || {
    state: 'welcome',
    answers: {},
    stepIndex: 0,
    createdAt: Date.now()
  };
}

export async function saveSession(userId, session) {
  await setKey(SESSION_PREFIX + userId, session, 14 * 24 * 3600);
}

export async function clearSession(userId) {
  await delKey(SESSION_PREFIX + userId);
}
