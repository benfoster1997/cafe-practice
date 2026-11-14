# FX Desk: your guide

FX Desk watches four forex pairs (EURUSD, GBPUSD, AUDUSD, USDJPY) every 15
minutes, applies ICT's "sweep, shift, gap" sequence exactly as written in
`SPEC.md`, and sends a notification with a ready-to-copy order ticket when a
full setup appears. You copy the ticket into MetaTrader 5 by hand, on your
**demo** account.

## The honest part first

- These rules **did not pass** their test on 2015 to 2020 prices. They came
  out at about zero, on too few trades to tell skill from luck, and the
  answer moved with the price feed (`research/RESULTS.md`). Our mechanical
  version of ICT's 62% retracement plan lost money clearly, so the app
  leaves it out.
- So treat every ticket as **practice**. The app keeps score for you. Real
  money stays locked until the demo record earns it.
- Expect it to be **quiet**: about one or two tickets a month. Most days
  the answer is "no trade". That is how this method behaves when nothing is
  fudged.
- You will **miss some**. The test assumed every alert is acted on within
  three minutes. Alerts for the London session arrive 07:00 to 10:00 UK
  time and New York ones 12:00 to 15:00.

## One-time setup (about 10 minutes, all on your iPhone)

1. Open the link Claude gave you and choose a passcode. (Done on 14 Nov.)
2. **Live prices.** Go to twelvedata.com, tap **Get your free API key**, and
   sign up on the free plan (no card). Copy the key from your dashboard.
   In FX Desk open **Setup**, paste it under "Live prices", tap **Save key**.
   It should say the first scan worked.
3. **Put FX Desk on your Home Screen.** In Safari tap the **Share** button,
   choose **Add to Home Screen**, then **Add**. Close Safari and open FX Desk
   from its new icon. It asks for your passcode once more: the Home Screen
   app keeps its own memory, separate from Safari.
4. **Turn on notifications.** In the Home Screen app open **Setup**, tap
   **Turn on notifications**, and choose **Allow**. A notification should
   arrive within a few seconds. An iPhone only allows this from the Home
   Screen app, never from a Safari tab.
5. **Balance.** Leave it at 500 (pounds) or set what you really plan to
   trade live. Tickets are sized at 1% of this, whatever your demo shows.

## How you know alerts still work

iPhone notifications from a web app are less dependable than a chat app, and
real alerts are rare, so a break could go unnoticed. Three safeguards:

- **A check-in every trading morning**, about 06:45 UK, saying which way
  each pair is leaning. **No check-in by 7am on a weekday means alerts are
  broken.** Open the app: it will say why in red.
- **A red warning in the app** if Apple has dropped the link or a
  notification was refused.
- **Send a test notification** in Setup, any time.

Things that silence notifications without anything being broken: a Focus
mode or Sleep schedule, and Settings, Notifications, FX Desk being switched
off. If you delete the Home Screen icon, notifications stop for good until
you add it again and turn them back on.

## When an alert arrives

1. Tap the notification. It opens the ticket.
2. In MetaTrader 5: Quotes, tap the pair, **Trade**, and change the order
   type to **Buy Limit** or **Sell Limit** as the ticket says.
3. Tap each number on the ticket to copy it, and paste it into MT5:
   **Volume**, **Price**, **Stop Loss**, **Take Profit**.
4. Set **Expiration** to **Specified** and enter the time the ticket gives
   "on the MT5 clock" (MT5 runs on your broker's clock, usually two or
   three hours ahead of UK time). If your MT5 will not take an expiry, set
   a phone alarm and **delete the order yourself** at the UK expiry time.
   This matters: in testing, orders left resting after their expiry lost
   money.
5. Tap **Place**. Then tap **I placed it** on the ticket (or **I skipped
   it**), so your own record builds up.
6. If price has already gone through the entry, **do not chase**. Skip it.
7. The app tells you when the entry trades, and when the trade ends. If it
   says an order expired or was withdrawn, delete it in MT5. If a trade is
   still open at the "close by" time (about 9pm UK), close it.

## What the screens mean

- **Now**: any live ticket, the day's killzone times in UK time, and
  earlier tickets with how they ended.
- **Watch**: for each pair, which way the rules are looking today and the
  levels they are watching.
- **Record**: the historical test result, your demo scoreboard, and the
  four conditions for unlocking real money.
- **Setup**: your price key, notifications, balance, the MT5 clock, alerts
  on or off, and "Scan now". Telegram is there as an optional backup.

## The rules the app will not break

1% of your balance per trade. Two trades a day at most. No new trade after
losing 2% in a day. Every order has a stop loss and a take profit. One
trade per pair, and never two trades that are really the same bet on one
currency. No adding to losers.

## If something looks wrong

- Red dot at the top: the scanner hit a problem; the line beside it says
  what. "No price-feed key" means step 2 above.
- No alerts for days: normal. Check the Watch screen; "No trade today" on
  most pairs is the usual state.
- Your MT5 price differs from the ticket by a pip or two: normal, brokers'
  feeds differ.
- Anything else: tell Claude what the screen says.
