const processUserData = (users: any[], period: string) => {
  const dailyStats: Record<string, { activeUsers: number; newUsers: number }> =
    {};
  const twoHourlyStats: Record<
    string,
    { activeUsers: number; newUsers: number }
  > = {};
  const monthlyStats: Record<
    string,
    { activeUsers: number; newUsers: number }
  > = {};
  const yearlyStats: Record<string, { activeUsers: number; newUsers: number }> =
    {};

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  let timeRange: string[] = [];

  if (period === "Last 6 Months") {
    timeRange = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(currentYear, currentMonth - i, 1);
      return date.toLocaleString("en-US", { month: "short", year: "numeric" });
    }).reverse();
  } else if (period === "This Year") {
    timeRange = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(currentYear, i, 1);
      return date.toLocaleString("en-US", { month: "short", year: "numeric" });
    });
  } else if (period === "Last Year") {
    timeRange = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(currentYear - 1, i, 1);
      return date.toLocaleString("en-US", { month: "short", year: "numeric" });
    });
  } else if (period === "All Time") {
    timeRange = Array.from({ length: 8 }, (_, i) =>
      (currentYear - (7 - i)).toString()
    );
  } else if (period === "Last Month") {
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const daysInLastMonth = new Date(lastMonthYear, lastMonth + 1, 0).getDate();

    timeRange = Array.from({ length: daysInLastMonth }, (_, i) => {
      return `${lastMonthYear}-${String(lastMonth + 1).padStart(
        2,
        "0"
      )}-${String(i + 1).padStart(2, "0")}`;
    });
  } else if (period === "This Month") {
    timeRange = Array.from({ length: currentDay }, (_, i) => {
      return `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-${String(i + 1).padStart(2, "0")}`;
    });
  } else if (period === "Today") {
    timeRange = Array.from(
      { length: 13 },
      (_, i) => `${String(i * 2).padStart(2, "0")}:00`
    );
  }

  users.forEach((user) => {
    const createdAt = new Date(user.createdAt);
    const monthYear = createdAt.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });
    const year = createdAt.getFullYear().toString();
    const day = `${createdAt.getFullYear()}-${String(
      createdAt.getMonth() + 1
    ).padStart(2, "0")}-${String(createdAt.getDate()).padStart(2, "0")}`;
    const hourSlot = `${String(
      Math.floor(createdAt.getHours() / 2) * 2
    ).padStart(2, "0")}:00`;

    if (period === "All Time") {
      if (!timeRange.includes(year)) return;

      if (!yearlyStats[year]) {
        yearlyStats[year] = { activeUsers: 0, newUsers: 0 };
      }
      if (user.status === "active") {
        yearlyStats[year].activeUsers += 1;
      }
      yearlyStats[year].newUsers += 1;
    } else if (period === "Last Month" || period === "This Month") {
      if (!timeRange.includes(day)) return;

      if (!dailyStats[day]) {
        dailyStats[day] = { activeUsers: 0, newUsers: 0 };
      }
      if (user.status === "active") {
        dailyStats[day].activeUsers += 1;
      }
      dailyStats[day].newUsers += 1;
    } else if (period === "Today") {
      if (createdAt.toDateString() !== today.toDateString()) return;

      if (!twoHourlyStats[hourSlot]) {
        twoHourlyStats[hourSlot] = { activeUsers: 0, newUsers: 0 };
      }
      if (user.status === "active") {
        twoHourlyStats[hourSlot].activeUsers += 1;
      }
      twoHourlyStats[hourSlot].newUsers += 1;
    } else {
      if (!timeRange.includes(monthYear)) return;

      if (!monthlyStats[monthYear]) {
        monthlyStats[monthYear] = { activeUsers: 0, newUsers: 0 };
      }
      if (user.status === "active") {
        monthlyStats[monthYear].activeUsers += 1;
      }
      monthlyStats[monthYear].newUsers += 1;
    }
  });

  if (period === "All Time") {
    return timeRange.map((year) => ({
      name: year,
      activeUsers: yearlyStats[year]?.activeUsers || 0,
      newUsers: yearlyStats[year]?.newUsers || 0,
    }));
  } else if (period === "Last Month" || period === "This Month") {
    return timeRange.map((day) => ({
      name: day,
      activeUsers: dailyStats[day]?.activeUsers || 0,
      newUsers: dailyStats[day]?.newUsers || 0,
    }));
  } else if (period === "Today") {
    return timeRange.map((hourSlot) => ({
      name: hourSlot,
      activeUsers: twoHourlyStats[hourSlot]?.activeUsers || 0,
      newUsers: twoHourlyStats[hourSlot]?.newUsers || 0,
    }));
  }

  return timeRange.map((month) => ({
    name: month,
    activeUsers: monthlyStats[month]?.activeUsers || 0,
    newUsers: monthlyStats[month]?.newUsers || 0,
  }));
};

export default processUserData;
