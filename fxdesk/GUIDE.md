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
  time and New York ones 12:00 to 15:00. For about three weeks a year (two
  in March, one around the start of November) American and British clocks
  are out of step and all of these, and the morning check-in, come one
  hour earlier in UK time. The app's Now screen always shows the day's
  real times.

## One-time setup (about 10 minutes, all on your iPhone)

1. Open the link Claude gave you and choose a passcode. (Done on 14 Nov.)
2. **Live prices.** Go to twelvedata.com, tap **Get your free API key**, and
   sign up on the free plan (no card). Copy the key from your dashboard.
   In FX Desk open **Setup**, paste it under "Live prices", tap **Save key**.
   It should say the first scan worked.
3. **Put FX Desk on your Home Screen.** In Safari tap the **Share** button
   (if you cannot see it, it is behind the three dots), choose **Add to
   Home Screen**, leave **Open as Web App** switched ON, then tap **Add**.
   Close Safari and open FX Desk from its new icon. It asks for your
   passcode once more: the Home Screen app keeps its own memory, separate
   from Safari. If the icon opens Safari with an address bar, delete the
   icon and add it again with Open as Web App switched on.
4. **Turn on notifications.** In the Home Screen app open **Setup**, tap
   **Turn on notifications**, and choose **Allow**. A notification should
   arrive within a few seconds. If you see no banner, swipe down from the
   top of the screen: it may be waiting in Notification Centre. An iPhone
   only allows this from the Home Screen app, never from a Safari tab.
5. **Make sure you will hear an alert.** This matters as much as step 4.
   - iPhone **Settings**, **Focus**: open each one you use (Sleep, Do Not
     Disturb, Work, Driving), tap **Apps**, and add **FX Desk**. A web app
     cannot break through a Focus by itself, and the London window opens at
     07:00 UK, when a Sleep schedule may still be running.
   - **Settings**, **Notifications**, **FX Desk**: Allow Notifications on;
     Lock Screen, Notification Centre and Banners ticked; Banner Style
     Persistent; Sounds on; not in Scheduled Summary.
   - With the phone on silent an alert only vibrates.
6. **Test the real route.** In Setup tap **Test from the scanner**, lock the
   phone, and wait. Within 15 minutes a notification should arrive by
   itself. That is the same route a trade alert takes, so if it arrives
   with a sound while the phone is locked, you are set.
7. **Balance.** Leave it at 500 (pounds) or set what you really plan to
   trade live. Tickets are sized at 1% of this, whatever your demo shows.

## How you know alerts still work

iPhone notifications from a web app are less dependable than a chat app, and
real alerts are rare, so a break could go unnoticed. The safeguards:

- **A check-in every trading morning**, about 06:45 UK ("FX Desk is
  running"). It says which way each pair is leaning that day (up, down or
  none). That is not an instruction: only a notification titled BUY LIMIT
  or SELL LIMIT is a ticket.
  - If it made a sound or lit the screen, all is well.
  - If you only find it later in Notification Centre, a Focus or Sleep mode
    muted it, and would mute a trade alert too. Fix step 5 above.
  - **If it is not there by 8am on a weekday, something is wrong.** Open the
    app: a red box on the Now screen says what. If nothing is red, go to
    Setup and tap **Send a test now**.
- **"FX Desk has a problem"** instead of the check-in, or during the day,
  means the scanner or its price feed has been failing for at least two
  scans. No trade alerts until you get **"FX Desk is running again"**.
- **Nothing is sent only once.** If Apple's service does not accept a
  notification, the scanner sends it again every 15 minutes until it does.
  An alert that goes out of date before Apple accepts it is shown in red in
  the app as "An alert never arrived".
- **A red box in the app** if Apple has dropped this phone's link, keeps
  refusing a notification, alerts are switched off, or the morning check-in
  was not sent. When Apple drops the link, opening the app from its icon
  reconnects it by itself and proves it with a notification.
- **Two test buttons in Setup**: "Send a test now", and "Test from the
  scanner" (arrives within 15 minutes, by the route a trade alert takes).
  If Apple accepts a test but nothing reaches the phone, use **Reset this
  phone's notifications** under "A test does not arrive?". If that does not
  cure it, delete the FX Desk icon, add it to the Home Screen again and
  turn notifications on again.

Do a test after every iOS update, and after moving to a new iPhone or
restoring a backup. If you delete the Home Screen icon, notifications stop
until you add it again and turn them back on. Turn notifications on from
the iPhone only, not also from a computer or iPad: a second device can hide
a fault on the phone.

## When an alert arrives

1. Tap the notification. It opens the ticket. (If you land on another
   screen, tap **Now** at the bottom.)
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
7. More notifications follow, each telling you what to do in MT5. The app
   cannot touch MetaTrader: only you can.
   - **"entry traded"**: your order should now be filled.
   - **"delete the order"**: it expired, or price reached the target
     without filling. Delete the pending order in MT5.
   - **"delete this order"**: the account rules (below) now rule this trade
     out, usually because another trade filled first. Delete the order, or
     close it if it has already filled.
   - **"close at 21:00 UK"**: sent a quarter of an hour before the
     end-of-day cut-off (about 9pm UK). If the trade is still open then,
     close it by hand. "cut-off reached, close it" follows if it was.
   - **"finished"**: the target or the stop was hit. Nothing to do.
   - **"found too late, skip"**: a setup was spotted only after price had
     already reached its entry. Do nothing.

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
