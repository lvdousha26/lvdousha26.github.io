// Fetches the GitHub contribution calendar into src/data/contributions.json.
// Never fails the build: on any error the existing snapshot is kept as-is.
import { execFileSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const configFile = resolve(root, 'src/site.config.ts')
const outFile = resolve(root, 'src/data/contributions.json')

const QUERY = `
query ($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}
`

function resolveToken() {
  const fromEnv = (process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '').trim()
  if (fromEnv) return fromEnv
  try {
    return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim()
  } catch {
    return ''
  }
}

async function resolveLogin() {
  const source = await readFile(configFile, 'utf8')
  const matched = source.match(/githubUsername:\s*['"]([^'"]+)['"]/)
  if (!matched) throw new Error('site.config.ts 里找不到 siteMeta.githubUsername')
  return matched[1]
}

async function readExisting() {
  try {
    return JSON.parse(await readFile(outFile, 'utf8'))
  } catch {
    return null
  }
}

// GitHub 的 level 是相对分位，这里按正贡献数的四分位近似，只用于回退快照。
function assignLevels(days) {
  const positives = days
    .map((day) => day.count)
    .filter((count) => count > 0)
    .sort((a, b) => a - b)
  if (!positives.length) return days.map((day) => ({ ...day, level: 0 }))

  const quantile = (q) => positives[Math.min(positives.length - 1, Math.floor(positives.length * q))]
  const [q1, q2, q3] = [quantile(0.25), quantile(0.5), quantile(0.75)]

  return days.map((day) => {
    let level = 0
    if (day.count > 0) level = 1
    if (day.count > q1) level = 2
    if (day.count > q2) level = 3
    if (day.count > q3) level = 4
    return { ...day, level }
  })
}

async function fetchCalendar(login, token) {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'blog-contribution-fetcher'
    },
    body: JSON.stringify({ query: QUERY, variables: { login } })
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const body = await response.json()
  if (body.errors?.length) throw new Error(body.errors.map((e) => e.message).join('; '))
  const calendar = body.data?.user?.contributionsCollection?.contributionCalendar
  if (!calendar) throw new Error('响应里没有 contributionCalendar')
  return calendar
}

async function main() {
  const existing = await readExisting()
  const token = resolveToken()
  if (!token) {
    console.warn('[contrib] 没有可用 token，保留现有快照')
    return
  }

  let login
  try {
    login = await resolveLogin()
  } catch (error) {
    console.warn(`[contrib] ${error.message}，保留现有快照`)
    return
  }

  let calendar
  try {
    calendar = await fetchCalendar(login, token)
  } catch (error) {
    console.warn(`[contrib] 拉取失败（${error.message}），保留现有快照`)
    return
  }

  const days = calendar.weeks.flatMap((week) =>
    week.contributionDays.map((day) => ({ date: day.date, count: day.contributionCount }))
  )
  const total = calendar.totalContributions

  if (!days.length || (total === 0 && (existing?.total?.lastYear ?? 0) > 0)) {
    console.warn(`[contrib] 数据异常（total=${total}，days=${days.length}），保留现有快照`)
    return
  }

  await mkdir(dirname(outFile), { recursive: true })
  await writeFile(
    outFile,
    `${JSON.stringify(
      {
        login,
        fetchedAt: new Date().toISOString(),
        total: { lastYear: total },
        contributions: assignLevels(days)
      },
      null,
      2
    )}\n`
  )
  console.log(`[contrib] ${login}：${total} 次贡献，${days.length} 天 -> src/data/contributions.json`)
}

await main()
