/**
 * calendar.ts - the scheduled events the models stand aside for.
 *
 * FOMC: decision day of every SCHEDULED Federal Reserve meeting, taken from
 * federalreserve.gov on 10 Nov 2026 (fxdesk/reference/fomc_dates.json keeps
 * the source note). Unscheduled meetings are excluded on purpose: nobody
 * could have known them in advance, so a backtest must not either.
 * NFP: by rule, the first Friday of the month. The Bureau of Labor
 * Statistics occasionally moves it (holidays, shutdowns); those exceptions
 * are NOT modelled, in the backtest or live, so the two stay identical.
 */
const FOMC = new Set<number>([
  20150128, 20150318, 20150429, 20150617, 20150729, 20150917, 20151028, 20151216,
  20160127, 20160316, 20160427, 20160615, 20160727, 20160921, 20161102, 20161214,
  20170201, 20170315, 20170503, 20170614, 20170726, 20170920, 20171101, 20171213,
  20180131, 20180321, 20180502, 20180613, 20180801, 20180926, 20181108, 20181219,
  20190130, 20190320, 20190501, 20190619, 20190731, 20190918, 20191030, 20191211,
  20200129, 20200318, 20200429, 20200610, 20200729, 20200916, 20201105, 20201216,
  20210127, 20210317, 20210428, 20210616, 20210728, 20210922, 20211103, 20211215,
  20220126, 20220316, 20220504, 20220615, 20220727, 20220921, 20221102, 20221214,
  20230201, 20230322, 20230503, 20230614, 20230726, 20230920, 20231101, 20231213,
  20240131, 20240320, 20240501, 20240612, 20240731, 20240918, 20241107, 20241218,
  20250129, 20250319, 20250507, 20250618, 20250730, 20250917, 20251029, 20251210,
  20260128, 20260318, 20260429, 20260617, 20260729, 20260916, 20261028, 20261209,
  20270127, 20270317, 20270428, 20270609, 20270728, 20270915, 20271027, 20271208,
]);

export const isFomcDay = (dayKey: number): boolean => FOMC.has(dayKey);

/** First Friday of the month (dow: 0 = Sunday ... 5 = Friday). */
export const isNfpDay = (dayKey: number, dow: number): boolean => dow === 5 && dayKey % 100 <= 7;
