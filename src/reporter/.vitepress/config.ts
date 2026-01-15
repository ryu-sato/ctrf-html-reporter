import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitepress'
import type { Plugin } from 'vite'
import { readReportFromFile } from 'ctrf'
import path from 'path'
import fs from 'fs/promises'
import send from 'send'

/**
 * Helper function to get attachment paths from CTRF report
 */
const getAttachmentPaths = async (reportPath: string): Promise<Map<string, string>> => {
  const attachmentMap = new Map<string, string>()

  try {
    const resolvedReportPath = path.resolve(process.cwd(), reportPath)
    const report = await readReportFromFile(resolvedReportPath)

    if (!report || !report.results || !report.results.tests) {
      return attachmentMap
    }

    const tests = report.results.tests
    const reportDir = path.dirname(resolvedReportPath)

    // Collect all attachments and screenshots from all tests
    for (const test of tests) {
      // Process attachments array
      if (test.attachments && Array.isArray(test.attachments)) {
        for (const attachment of test.attachments) {
          if (attachment.path) {
            // Normalize the path and create URL path
            const normalizedPath = path.normalize(attachment.path).replace(/\\/g, '/')
            const urlPath = normalizedPath.startsWith('/') ? normalizedPath : '/' + normalizedPath

            // Map URL path to actual file path
            const sourcePath = path.resolve(reportDir, attachment.path)
            attachmentMap.set(urlPath, sourcePath)
          }
        }
      }

      // Process screenshot field
      if (test.screenshot && typeof test.screenshot === 'string') {
        // Normalize the path and create URL path
        const normalizedPath = path.normalize(test.screenshot).replace(/\\/g, '/')
        const urlPath = normalizedPath.startsWith('/') ? normalizedPath : '/' + normalizedPath

        // Map URL path to actual file path
        const sourcePath = path.resolve(reportDir, test.screenshot)
        attachmentMap.set(urlPath, sourcePath)
      }
    }
  } catch (error) {
    console.warn('Failed to load attachment paths:', error)
  }

  return attachmentMap
}

/**
 * Vite plugin to handle attachment files in both dev and build modes
 */
const copyAttachmentsPlugin = (): Plugin => {
  let outDir: string | undefined
  let attachmentMapPromise: Promise<Map<string, string>> | null = null
  let reportPath: string | undefined

  const getOrLoadAttachmentMap = async (): Promise<Map<string, string>> => {
    if (!attachmentMapPromise && reportPath) {
      attachmentMapPromise = getAttachmentPaths(reportPath)
    }
    return attachmentMapPromise || new Map()
  }

  return {
    name: 'copy-ctrf-attachments',
    configResolved(config) {
      // Capture the output directory and mode from Vite config
      outDir = config.build.outDir
      reportPath = process.env.CTRF_REPORT_PATH
    },
    async buildStart() {
      // Preload attachment paths for build mode
      if (reportPath) {
        await getOrLoadAttachmentMap()
      }
    },
    configureServer(server) {
      // Preload attachment map on server start
      getOrLoadAttachmentMap()

      // Add middleware for dev mode to serve attachment files
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) {
          return next()
        }

        try {
          const attachmentMap = await getOrLoadAttachmentMap()

          if (attachmentMap.has(req.url)) {
            const filePath = attachmentMap.get(req.url)!

            // Use send library to serve the file with proper Content-Type and caching
            send(req, filePath, { root: '/' })
              .on('error', (error) => {
                console.warn(`Failed to read attachment file: ${filePath}`, error)
                next()
              })
              .pipe(res)
            return
          }
        } catch (error) {
          console.warn('Failed to load attachment map:', error)
        }

        next()
      })
    },
    async closeBundle() {
      if (!reportPath) {
        return
      }

      try {
        const attachmentMap = await getOrLoadAttachmentMap()
        if (attachmentMap.size === 0) {
          return
        }

        const attachmentsToCopy: Array<{ sourcePath: string; destPath: string }> = []

        // Collect all attachments to copy
        for (const [urlPath, sourcePath] of attachmentMap.entries()) {
          const relativePath = urlPath.startsWith('/') ? urlPath.slice(1) : urlPath
          const outputDir = outDir || '.vitepress/dist'
          const destPath = path.resolve(outputDir, relativePath)
          attachmentsToCopy.push({ sourcePath, destPath })
        }

        // Copy all attachments
        if (attachmentsToCopy.length > 0) {
          console.log(`Copying ${attachmentsToCopy.length} attachment(s)...`)

          for (const { sourcePath, destPath } of attachmentsToCopy) {
            try {
              // Create destination directory if it doesn't exist
              await fs.mkdir(path.dirname(destPath), { recursive: true })

              // Copy the file
              await fs.copyFile(sourcePath, destPath)
              console.log(`  Copied: ${path.basename(sourcePath)} -> ${destPath}`)
            } catch (error) {
              console.warn(`  Failed to copy attachment: ${sourcePath}`, error)
            }
          }
        }
      } catch (error) {
        console.warn('Failed to process attachments:', error)
      }
    }
  }
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "CTCF HTML Reporter",
  description: "Report test result of CTRF (Common Test Report Format)",
  vite: {
    resolve: {
      alias: {
        'ctrf': 'ctrf'
      }
    },
    ssr: {
      noExternal: ['ctrf', 'chart.js']
    },
    plugins: [
      tailwindcss(),
      copyAttachmentsPlugin(),
    ],
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Overview', link: '#overview' },
      { text: 'Suites', link: '#suites' },
      { text: 'Insights', link: '#insights' },
      { text: 'Timeline', link: '#timeline' },
      { text: 'AI', link: '#ai' },
    ],

    sidebar: [
      {
        text: 'Report',
        items: [
          { text: 'Overview', link: '#overview' },
          { text: 'Suites', link: '#suites' },
          { text: 'Insights', link: '#insights' },
          { text: 'Timeline', link: '#timeline' },
          { text: 'AI', link: '#ai' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ryu-sato/ctrf-html-reporter' }
    ]
  },
});
