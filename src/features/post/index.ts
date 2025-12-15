/**
 * Post Feature Module
 *
 * ARCHITECTURE NOTE: This feature intentionally does NOT have its own API service or types.
 * Posts are a sub-feature of classrooms in this application's domain model. All post-related
 * API operations are handled through the classroom service (classService) from the classroom
 * feature, and all types are imported from the classroom types.
 *
 * This design decision reflects that:
 * - Posts cannot exist independently of a classroom
 * - Post operations are classroom-scoped (create, read, update, delete all require a classId)
 * - Types like Post, Material, etc. are part of the classroom domain
 *
 * If posts need to become an independent feature in the future, this structure can be refactored
 * to include dedicated api/ and types.ts files.
 */

export * from './hooks'
export * from './components'
