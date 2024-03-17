type RecordSet = Record<string, any>

type Flattened<T, K extends keyof T> = T[K] & {
  [P in Exclude<keyof T, K>]: Array<T[P]>
}

export function flattenData<
  T extends RecordSet,
  K extends keyof T,
  PK extends keyof T[K] & string,
>(data: T[], parentEntity: K, primaryKey: PK): Array<Flattened<T, K>> {
  const parents: Record<string, Flattened<T, K>> = {}

  data.forEach((item) => {
    const parent = item[parentEntity]
    if (!parent || parent[primaryKey] === undefined) {
      throw new Error(
        `Primary key '${String(
          primaryKey,
        )}' not found in parent entity '${String(parentEntity)}'`,
      )
    }

    const parentId = String(parent[primaryKey])
    if (!parents[parentId]) {
      parents[parentId] = { ...parent } satisfies Flattened<T, K>
    }

    Object.keys(item).forEach((key) => {
      if (key !== parentEntity) {
        if (!parents[parentId][key]) {
          parents[parentId][key] = []
        }
        ;(parents[parentId][key] as any[]).push(item[key])
      }
    })
  })

  return Object.values(parents)
}
