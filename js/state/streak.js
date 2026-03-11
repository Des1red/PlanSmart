export function evaluateStreak(plan) {

  const today = new Date();
  const todayStr = today.toISOString().slice(0,10);

  const streak = plan.streak;

  if (streak.lastEvaluatedDate === todayStr) {
    return false;
  }

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const calMonth = new Date(
    plan.calendar.year,
    new Date(Date.parse(plan.calendar.month +" 1")).getMonth(),
    1
  );
  
  const sameMonth =
    yesterday.getFullYear() === calMonth.getFullYear() &&
    yesterday.getMonth() === calMonth.getMonth();
  
  let day = null;
  
  if (sameMonth) {
    const yesterdayDay = yesterday.getDate();
    day = plan.calendar.days.find(d => d.day === yesterdayDay);
  }

  if (!day) {
    streak.lastEvaluatedDate = todayStr;
    return true;
  }

  const total = day.tasks.length;
  const done = day.done ? day.done.length : 0;

  if (total === 0) {
    streak.lastEvaluatedDate = todayStr;
    return true;
  }

  if (done === total) {
    streak.current += 1;
    streak.best = Math.max(streak.best, streak.current);
  } else {
    streak.current = 0;
  }

  streak.lastEvaluatedDate = todayStr;

  return true;
}