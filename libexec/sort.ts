#!//usr/bin/env -S pkgx deno run --allow-read --allow-env

import { parseFlags } from "cliffy/flags/mod.ts"
import { utils, plumbing, hooks } from "pkgx"
const { parse, str } = utils.pkg
const { usePantry } = hooks
const { hydrate } = plumbing

const { flags: { delimiter: separator }, unknown: args } = parseFlags(Deno.args, {
  flags: [{
    name: "delimiter",
    aliases: ["d"],
    type: "string",
    default: "\n",
    required: false
  }],
})


const pantry = usePantry()

const dry = args.map(parse)
const wet = await hydrate(dry, async (pkg, dry) => {
  const deps = await pantry.getDeps(pkg)
  return dry ? [...deps.build, ...deps.runtime] : deps.runtime
})

console.info(wet.dry.map(str).join(separator))
