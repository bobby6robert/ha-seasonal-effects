# Changelog

## 1.1.0
- New **day off** effect (sun, clouds, butterflies): Polish public holidays built in, plus days off from calendars (`dayoff_calendars`).
- **Timing for every occasion**, separately for tablets and phones/computers: time window, animation length, repeat, banner time. Quiet hours at night.
- **Settings panel on the dashboard** (`show_settings: true`) with preview, *this device is* switch and *start today's effects again*.
- Intensity per occasion (number of elements, visibility, speed) and switchable parts of every scene.
- Several occasions on one day (birthday + name day, two birthdays, …) are shown in **one greeting**; family birthdays and other people's birthdays from calendars are separate occasions.
- The greeting no longer comes back on every view change; it is shown when an animation starts.
- `exclude_views`, `seasonalEffects.chipVisible()` for dashboard badges, `Day off` / `Dzień wolny` helper option.

## 1.0.0
- First public release: Halloween, Christmas, New Year's Eve, Valentine's Day, Easter and family occasions.
- Setup wizard in the card editor (English / Polish), one-click control helper.
- Birthdays and anniversaries from calendars, name-day sensor support.
- Light mode for tablets, adjustable intensity, reduce-motion support.
