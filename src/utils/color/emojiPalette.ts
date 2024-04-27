import { Color } from "three"

const colorEmojis = ["⚫️", "⚪️", "🔴", "🟠", "🟡", "🟢", "🔵", "🟣"] as const

type ColorEmoji = (typeof colorEmojis)[number]

const l = 0.1
const h = 0.95

const emojiPalette: { [K in ColorEmoji]: Color } = {
  "⚫️": new Color(l, l, l),
  "⚪️": new Color(h, h, h),
  "🔴": new Color(h, l, l),
  "🟠": new Color(h, 0.5, l),
  "🟡": new Color(h, h, l),
  "🟢": new Color(l, h, l),
  "🔵": new Color(l, l, h),
  "🟣": new Color(h, l, h),
}

export function getEmojiColor(str: string) {
  const color = new Color(0, 0, 0)
  let count = 0
  for (const emoji of colorEmojis) {
    if (str.includes(emoji)) {
      count++
      color.add(emojiPalette[emoji])
    }
  }
  if (count > 1) {
    color.multiplyScalar(1 / count)
  }
  if (count >= 1) {
    return color
  }
  return undefined
}
