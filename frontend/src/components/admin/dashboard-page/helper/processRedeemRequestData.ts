const processRedeemRequestData = (requests: any[], period: string) => {
  const dailyStats: Record<string, { created: number }> = {};
  const twoHourlyStats: Record<string, { created: number }> = {};
  const monthlyStats: Record<string, { created: number }> = {};
  const yearlyStats: Record<string, { created: number }> = {};

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  let timeRange: string[] = [];

  // Time range generation
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

  // Aggregate data
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
      if (!yearlyStats[year]) yearlyStats[year] = { created: 0 };
      yearlyStats[year].created += 1;
    } else if (period === "Last Month" || period === "This Month") {
      if (!timeRange.includes(day)) return;
      if (!dailyStats[day]) dailyStats[day] = { created: 0 };
      dailyStats[day].created += 1;
    } else if (
      period === "Today" &&
      createdAt.toDateString() === today.toDateString()
    ) {
      if (!twoHourlyStats[hourSlot]) twoHourlyStats[hourSlot] = { created: 0 };
      twoHourlyStats[hourSlot].created += 1;
    } else if (period === "Yesterday") {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      if (createdAt.toDateString() !== yesterday.toDateString()) return;
      if (!twoHourlyStats[hourSlot]) twoHourlyStats[hourSlot] = { created: 0 };
      twoHourlyStats[hourSlot].created += 1;
    } else {
      if (!timeRange.includes(monthYear)) return;
      if (!monthlyStats[monthYear]) monthlyStats[monthYear] = { created: 0 };
      monthlyStats[monthYear].created += 1;
    }
  });

  // Format for chart
  if (period === "All Time") {
    return timeRange.map((year) => ({
      name: year,
      new: yearlyStats[year]?.created || 0,
    }));
  } else if (period === "Last Month" || period === "This Month") {
    return timeRange.map((day) => ({
      name: day,
      new: dailyStats[day]?.created || 0,
    }));
  } else if (period === "Today" || period === "Yesterday") {
    return timeRange.map((hourSlot) => ({
      name: hourSlot,
      new: twoHourlyStats[hourSlot]?.created || 0,
    }));
  }

  return timeRange.map((month) => ({
    name: month,
    new: monthlyStats[month]?.created || 0,
  }));
};

export default processRedeemRequestData;
