#!/usr/bin/env node

/**
 *
 * Release smoke test.
 *
 * Packs the tarball and installs it into a clean temp project the way an
 * end user would (no devDependencies anywhere in the tree), then runs the
 * CLI. Guards against undeclared runtime dependencies and broken packaging,
 * which unit tests can't catch because the dev tree hoists devDependency
 * modules that mask missing declarations (see the boxt/chalk incident in
 * harp 0.50.0).
 *
 */

var os   = require("os")
var fs   = require("fs")
var path = require("path")
var execFileSync = require("child_process").execFileSync

var root = path.join(__dirname, "..")
var pkg  = require(path.join(root, "package.json"))
var tmp  = fs.mkdtempSync(path.join(os.tmpdir(), "harp-smoke-"))

var run = function(cmd, args, opts){
  return execFileSync(cmd, args, Object.assign({ encoding: "utf8" }, opts))
}

var fail = function(msg){
  console.error("smoke test FAILED: " + msg)
  process.exit(1)
}

try {
  console.log("packing harp...")
  run("npm", ["pack", "--pack-destination", tmp], { cwd: root })
  var tarball = path.join(tmp, "harp-" + pkg.version + ".tgz")

  console.log("installing tarball into a clean project...")
  fs.writeFileSync(path.join(tmp, "package.json"), "{}")
  run("npm", ["install", tarball, "--no-audit", "--no-fund"], { cwd: tmp })

  var bin = path.join(tmp, "node_modules", "harp", "bin", "harp")

  console.log("running harp --version...")
  var version = run("node", [bin, "--version"], { cwd: tmp }).trim()
  if (version !== "v" + pkg.version) fail("expected v" + pkg.version + ", got " + JSON.stringify(version))

  console.log("running harp (help)...")
  var help = run("node", [bin], { cwd: tmp })
  if (help.indexOf("USAGE") === -1 || help.indexOf("╭") === -1) fail("help output missing expected content")

  console.log("compiling a sample project...")
  fs.mkdirSync(path.join(tmp, "site"))
  fs.writeFileSync(path.join(tmp, "site", "index.md"), "# hello world")
  run("node", [bin, "site", "out"], { cwd: tmp })
  var html = fs.readFileSync(path.join(tmp, "out", "index.html"), "utf8")
  if (html.indexOf("hello world") === -1) fail("compiled output missing expected content")

  console.log("smoke test PASSED")
} finally {
  fs.rmSync(tmp, { recursive: true, force: true })
}
