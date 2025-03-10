const processRequestData = (requests: any[], period: string) => {
  const dailyStats: Record<
    string,
    { pending: number; new: number; completed: number; cancelled: number }
  > = {};
  const twoHourlyStats: Record<
    string,
    { pending: number; new: number; completed: number; cancelled: number }
  > = {};
  const monthlyStats: Record<
    string,
    { pending: number; new: number; completed: number; cancelled: number }
  > = {};
  const yearlyStats: Record<
    string,
    { pending: number; new: number; completed: number; cancelled: number }
  > = {};

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

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
  } else if (period === "Last Month" || period === "This Month") {
    const targetMonth =
      period === "Last Month" ? currentMonth - 1 : currentMonth;
    const targetYear =
      period === "Last Month" && currentMonth === 0
        ? currentYear - 1
        : currentYear;
    const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

    timeRange = Array.from({ length: daysInMonth }, (_, i) => {
      return `${targetYear}-${String(targetMonth + 1).padStart(
        2,
        "0"
      )}-${String(i + 1).padStart(2, "0")}`;
    });
  } else if (period === "Today" || period === "Yesterday") {
    timeRange = Array.from(
      { length: 12 },
      (_, i) =>
        `${String(i * 2).padStart(2, "0")}:00 - ${String(i * 2 + 2).padStart(
          2,
          "0"
        )}:00`
    );
  }

  requests.forEach((request) => {
    const createdAt = new Date(request.createdAt);
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
    ).padStart(2, "0")}:00 - ${String(
      Math.floor(createdAt.getHours() / 2) * 2 + 2
    ).padStart(2, "0")}:00`;

    if (period === "All Time") {
      if (!timeRange.includes(year)) return;

      if (!yearlyStats[year]) {
        yearlyStats[year] = { pending: 0, new: 0, completed: 0, cancelled: 0 };
      }
      if (request.status === "active") {
        yearlyStats[year].pending += 1;
      } else if (request.status === "completed") {
        yearlyStats[year].completed += 1;
      } else if (request.status === "cancelled") {
        yearlyStats[year].completed += 1;
      }
      yearlyStats[year].new += 1;
    } else if (period === "Last Month" || period === "This Month") {
      if (!timeRange.includes(day)) return;

      if (!dailyStats[day]) {
        dailyStats[day] = { pending: 0, new: 0, completed: 0, cancelled: 0 };
      }
      if (request.status === "active") {
        dailyStats[day].pending += 1;
      } else if (request.status === "completed") {
        dailyStats[day].completed += 1;
      } else if (request.status === "cancelled") {
        dailyStats[day].completed += 1;
      }
      dailyStats[day].new += 1;
    } else if (
      period === "Today" &&
      createdAt.toDateString() === today.toDateString()
    ) {
      if (!twoHourlyStats[hourSlot]) {
        twoHourlyStats[hourSlot] = {
          pending: 0,
          new: 0,
          completed: 0,
          cancelled: 0,
        };
      }
      if (request.status === "active") {
        twoHourlyStats[hourSlot].pending += 1;
      } else if (request.status === "completed") {
        twoHourlyStats[hourSlot].completed += 1;
      } else if (request.status === "cancelled") {
        twoHourlyStats[hourSlot].completed += 1;
      }
      twoHourlyStats[hourSlot].new += 1;
    } else if (period === "Yesterday") {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (createdAt.toDateString() !== yesterday.toDateString()) return;

      if (!twoHourlyStats[hourSlot]) {
        twoHourlyStats[hourSlot] = {
          pending: 0,
          new: 0,
          completed: 0,
          cancelled: 0,
        };
      }
      if (request.status === "active") {
        twoHourlyStats[hourSlot].pending += 1;
      } else if (request.status === "completed") {
        twoHourlyStats[hourSlot].completed += 1;
      } else if (request.status === "cancelled") {
        twoHourlyStats[hourSlot].completed += 1;
      }
      twoHourlyStats[hourSlot].new += 1;
    } else {
      if (!timeRange.includes(monthYear)) return;

      if (!monthlyStats[monthYear]) {
        monthlyStats[monthYear] = {
          pending: 0,
          new: 0,
          completed: 0,
          cancelled: 0,
        };
      }
      if (request.status === "active") {
        monthlyStats[monthYear].pending += 1;
      } else if (request.status === "completed") {
        monthlyStats[monthYear].completed += 1;
      } else if (request.status === "cancelled") {
        monthlyStats[monthYear].completed += 1;
      }
      monthlyStats[monthYear].new += 1;
    }
  });

  if (period === "All Time") {
    return timeRange.map((year) => ({
      name: year,
      pending: yearlyStats[year]?.pending || 0,
      new: yearlyStats[year]?.new || 0,
      completed: yearlyStats[year]?.completed || 0,
      cancelled: yearlyStats[year]?.cancelled || 0,
    }));
  } else if (period === "Last Month" || period === "This Month") {
    return timeRange.map((day) => ({
      name: day,
      pending: dailyStats[day]?.pending || 0,
      new: dailyStats[day]?.new || 0,
      completed: dailyStats[day]?.completed || 0,
      cancelled: dailyStats[day]?.cancelled || 0,
    }));
  } else if (period === "Today" || period === "Yesterday") {
    return timeRange.map((hourSlot) => ({
      name: hourSlot,
      pending: twoHourlyStats[hourSlot]?.pending || 0,
      new: twoHourlyStats[hourSlot]?.new || 0,
      completed: twoHourlyStats[hourSlot]?.completed || 0,
      cancelled: twoHourlyStats[hourSlot]?.cancelled || 0,
    }));
  }

  return timeRange.map((month) => ({
    name: month,
    pending: monthlyStats[month]?.pending || 0,
    new: monthlyStats[month]?.new || 0,
    completed: monthlyStats[month]?.completed || 0,
    cancelled: monthlyStats[month]?.cancelled || 0,
  }));
};

export default processRequestData;
