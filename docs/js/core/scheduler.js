import { getDateInfo } from "../state/date.js";

export function generateCalendar(plan) {

  const { now, month, year } = getDateInfo();
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dailyCapacity = plan.hoursPerDay * 60;

  const calendar = [];
  const weeklyCount = new Map();
  const taskMap = new Map(plan.tasks.map(t => [t.id, t]));
  for (let i = 0; i < days; i++) {
    calendar.push({
      day: i + 1,
      tasks: [],
      total: 0
    });
  }

  const occurrences = expandTasks(plan.tasks, days);

  occurrences.sort((a, b) => b.time - a.time);

  for (const task of occurrences) {

    let bestDay = null;
    let bestScore = Infinity;

    for (const day of calendar) {
    
      if (day.total + task.time > dailyCapacity) continue;
      if (day.tasks.includes(task.id)) continue;
    
      const weekIndex = Math.floor((day.day - 1) / 7);
    
      const key = task.id + "-" + weekIndex;
      const weekCount = weeklyCount.get(key) || 0;
    
      const taskInfo = taskMap.get(task.id);
    
      if (taskInfo.type !== "monthly" && weekCount >= taskInfo.timesPerWeek) continue;
    
      /* base load score */
      let score = day.total;
    
      /* spacing penalty (avoid clustering) */
      const distancePenalty = calendar.reduce((penalty, d) => {
      
        if (!d.tasks.includes(task.id)) return penalty;
      
        const dist = Math.abs(d.day - day.day);
      
        if (dist === 0) return penalty;
      
        return penalty + Math.max(0, 4 - dist) * 10;
      
      }, 0);
    
      score += distancePenalty;
    
      /* reward grouping same place */
      const hasSamePlace = day.tasks.some(id => {
        const t = taskMap.get(id);
        return t && t.place === task.place;
      });
    
      if (hasSamePlace) score -= 5;
    
      if (score < bestScore) {
        bestScore = score;
        bestDay = day;
      }
    
    }

    if (!bestDay) {
    
      const candidates = calendar.filter(day =>
        !day.tasks.includes(task.id) &&
        day.total + task.time <= dailyCapacity
      );
    
      if (candidates.length > 0) {
        bestDay = candidates.reduce((a, b) => (a.total < b.total ? a : b));
      }
    
    }
    if (!bestDay) continue;
    bestDay.tasks.push(task.id);
    bestDay.total += task.time;
    const placedWeek = Math.floor((bestDay.day - 1) / 7);
    const placedKey = task.id + "-" + placedWeek;

    weeklyCount.set(placedKey, (weeklyCount.get(placedKey) || 0) + 1);

  }

  return {
    month,
    year,
    weeks: Math.ceil(days / 7),
    days: calendar
  };

}
function expandTasks(tasks, days) {

  const list = [];
  const weeks = Math.ceil(days / 7);

  for (const t of tasks) {

    const count =
      t.type === "monthly"
        ? 1
        : t.timesPerWeek * weeks;

    for (let i = 0; i < count; i++) {

      list.push({
        id: t.id,
        time: t.time,
        place: t.place
      });

    }

  }

  return list;

}