import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Convert the module URL to a file path
const __filename = fileURLToPath(import.meta.url)

// Get the directory name from the file path
const __dirname = path.dirname(__filename)

// Import necessary tools and types from Iconify packages
import { cleanupSVG, importDirectory, isEmptyColor, parseColors, runSVGO } from '@iconify/tools'
import type { IconifyJSON } from '@iconify/types'
import { getIcons, getIconsCSS, stringToIcon } from '@iconify/utils'

// Function to dynamically import JSON files based on prefix
const importJsonFile = async (prefix: string) => {
  const { default: jsonFile } = await import(`@iconify/json/json/${prefix}.json`, {
    assert: { type: 'json' }
  })
  return jsonFile
}

// Define types for the script configuration
interface BundleScriptCustomSVGConfig {
  dir: string
  monotone: boolean
  prefix: string
}

interface BundleScriptCustomJSONConfig {
  filename: string
  icons?: string[]
}

interface BundleScriptConfig {
  svg?: BundleScriptCustomSVGConfig[]
  icons?: string[]
  json?: (string | BundleScriptCustomJSONConfig)[]
}

// Example configuration
const sources: BundleScriptConfig = {
  json: [
    await importJsonFile('ri') // Dynamically import 'ri' JSON
  ]
}

// Target CSS file
const target = path.join(__dirname, 'generated-icons.css')

// Main async function to process icons
;(async function () {
  // Ensure output directory exists
  const dir = path.dirname(target)

  try {
    await fs.mkdir(dir, { recursive: true })
  } catch (err: any) {
    console.error(`Error creating directory: ${err.message}`)
  }

  const allIcons: IconifyJSON[] = []

  // Convert sources.icons to sources.json if necessary
  if (sources.icons) {
    const sourcesJSON = sources.json ? sources.json : (sources.json = [])
    const organizedList = organizeIconsList(sources.icons)

    for (const prefix in organizedList) {
      const filename = await importJsonFile(prefix)

      sourcesJSON.push({
        filename,
        icons: organizedList[prefix]
      })
    }
  }

  // Bundle JSON files and collect icons
  if (sources.json) {
    for (let i = 0; i < sources.json.length; i++) {
      const item = sources.json[i]
      const filename = typeof item === 'string' ? item : item.filename
      const content = await importJsonFile(filename) // Fix importJsonFile usage

      // Filter icons
      if (typeof item !== 'string' && item.icons?.length) {
        const filteredContent = getIcons(content, item.icons)

        if (!filteredContent) throw new Error(`Cannot find required icons in ${filename}`)

        // Collect filtered icons
        allIcons.push(filteredContent)
      } else {
        // Collect all icons from the JSON file
        allIcons.push(content)
      }
    }
  }

  // Bundle custom SVG icons and collect icons
  if (sources.svg) {
    for (let i = 0; i < sources.svg.length; i++) {
      const source = sources.svg[i]

      // Import icons
      const iconSet = await importDirectory(source.dir, {
        prefix: source.prefix
      })

      // Validate, clean up, fix palette, etc.
      await iconSet.forEach(async (name, type) => {
        if (type !== 'icon') return

        // Get SVG instance for parsing
        const svg = iconSet.toSVG(name)

        if (!svg) {
          // Invalid icon
          iconSet.remove(name)
          return
        }

        // Clean up and optimise icons
        try {
          await cleanupSVG(svg)

          if (source.monotone) {
            await parseColors(svg, {
              defaultColor: 'currentColor',
              callback: (attr, colorStr, color) => {
                return !color || isEmptyColor(color) ? colorStr : 'currentColor'
              }
            })
          }

          await runSVGO(svg)
        } catch (err) {
          console.error(`Error parsing ${name} from ${source.dir}:`, err)
          iconSet.remove(name)
          return
        }

        // Update icon from SVG instance
        iconSet.fromSVG(name, svg)
      })

      // Collect the SVG icon
      allIcons.push(iconSet.export())
    }
  }

  // Generate CSS from collected icons
  const cssContent = allIcons
    .map(iconSet => getIconsCSS(iconSet, Object.keys(iconSet.icons), { iconSelector: '.{prefix}-{name}' }))
    .join('\n')

  // Save the CSS to a file
  await fs.writeFile(target, cssContent, 'utf8')

  console.log(`Saved CSS to ${target}!`)
})().catch(err => {
  console.error(err)
})

// Function to sort icon names by prefix
function organizeIconsList(icons: string[]): Record<string, string[]> {
  const sorted: Record<string, string[]> = Object.create(null)

  icons.forEach(icon => {
    const item = stringToIcon(icon)
    if (!item) return

    const prefix = item.prefix
    const prefixList = sorted[prefix] ? sorted[prefix] : (sorted[prefix] = [])

    const name = item.name
    if (!prefixList.includes(name)) prefixList.push(name)
  })

  return sorted
}
