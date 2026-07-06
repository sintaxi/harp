var colors = require("@colors/colors/safe")


/**
 *
 * Box
 *
 * Draws a border around a multi-line message for CLI output.
 * Vendored replacement for the `boxt` package (which required
 * chalk at runtime without declaring it as a dependency).
 *
 * box("hello", { color: "grey", padding: 2, theme: "round", align: "left" })
 *
 */

var themes = {
  single: { h: "─", v: "│", tl: "┌", tr: "┐", bl: "└", br: "┘" },
  double: { h: "═", v: "║", tl: "╔", tr: "╗", bl: "╚", br: "╝" },
  round:  { h: "─", v: "│", tl: "╭", tr: "╮", bl: "╰", br: "╯" }
}

// visible width of a line, ignoring ANSI style sequences
var visibleLength = function(line){
  return line.replace(/\x1b\[[0-9;]*m/g, "").length
}

module.exports = function(message, options){
  options = options || {}

  var color   = options.color || "yellow"
  var padding = options.padding != null ? options.padding : 2
  var align   = options.align || "center"
  var theme   = themes[options.theme || "single"]

  if (typeof colors[color] !== "function") throw new Error('unsupported color "' + color + '"')
  if (!theme) throw new Error('unsupported theme "' + options.theme + '"')

  var paint = colors[color]
  var lines = message.split("\n")
  var width = Math.max.apply(null, lines.map(visibleLength))
  var space = width + padding * 2
  var pad   = " ".repeat(padding)

  var side  = paint(theme.v)
  var blank = side + " ".repeat(space) + side

  var row = function(line){
    // pad to the visible width, compensating for invisible style chars
    var w = width + line.length - visibleLength(line)
    var content
    if (align === "left" || align === "start"){
      content = line.padEnd(w, " ")
    } else if (align === "right" || align === "end"){
      content = line.padStart(w, " ")
    } else {
      content = line.padEnd(Math.ceil(w - (w - visibleLength(line)) / 2), " ").padStart(w, " ")
    }
    return side + pad + content + pad + side
  }

  return [
    "",
    paint(theme.tl + theme.h.repeat(space) + theme.tr),
    blank
  ].concat(lines.map(row), [
    blank,
    paint(theme.bl + theme.h.repeat(space) + theme.br),
    ""
  ]).join("\n")
}
