'use server'

import { ZodError } from 'zod'

import { getModerationBlockMessage, moderateMenfessPayload } from '@/lib/menfess/moderation'
import { menfessPayloadSchema, normalizeMenfessPayload, type MenfessPayloadInput } from '@/lib/menfess/schema'
import { createSupabasePublishableClient, createSupabaseSecretClient } from '@/lib/supabase/server'
import type { ActionResult, MenfessListData, MenfessRecord } from '@/types/menfess'
import type { MenfessReactionName } from '@/types/menfess'
import { revalidatePath } from 'next/cache'

const MENFESS_SELECT_FIELDS = 'id,message,from,to,created_at,laugh,love,sad,angry' as const
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const MAX_LIMIT = 50

type GetMenfessListActionParams = {
  page?: number
  limit?: number
}

type UpdateMenfessReactionActionParams = {
  id: string
  reaction: MenfessReactionName
  delta: 1 | -1
}

const sanitizePage = (value?: number) => {
  if (!value || Number.isNaN(value)) {
    return DEFAULT_PAGE
  }

  return Math.max(1, Math.floor(value))
}

const sanitizeLimit = (value?: number) => {
  if (!value || Number.isNaN(value)) {
    return DEFAULT_LIMIT
  }

  return Math.min(MAX_LIMIT, Math.max(1, Math.floor(value)))
}

const getValidationErrorMessage = (error: ZodError) =>
  error.issues.map((issue) => issue.message).join(', ')

const normalizeMenfessRecord = (item: MenfessRecord): MenfessRecord => ({
  ...item,
  laugh: item.laugh ?? 0,
  love: item.love ?? 0,
  sad: item.sad ?? 0,
  angry: item.angry ?? 0
})

export async function createMenfessAction(
  input: MenfessPayloadInput
): Promise<ActionResult<MenfessRecord>> {
  try {
    const payload = menfessPayloadSchema.parse(normalizeMenfessPayload(input))
    const moderation = await moderateMenfessPayload(payload)

    if (!moderation.allowed) {
      return {
        success: false,
        message: 'Menfess message was blocked by moderation.',
        error: getModerationBlockMessage(moderation.reason)
      }
    }

    const supabase = createSupabasePublishableClient()

    const { data, error } = await supabase
      .from('menfess')
      .insert({
        message: payload.message,
        from: payload.from ?? null,
        to: payload.to ?? null
      })
      .select(MENFESS_SELECT_FIELDS)
      .single()

    if (error) {
      return {
        success: false,
        message: 'Failed to save menfess message.',
        error: error.message
      }
    }

    if (!data) {
      return {
        success: false,
        message: 'Menfess message was not returned after insert.',
        error: 'No row was returned from Supabase.'
      }
    }

    revalidatePath('/fun-corners')

    return {
      success: true,
      message: 'Menfess message saved successfully.',
      data
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: 'Validation failed.',
        error: getValidationErrorMessage(error)
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred while creating menfess.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function getMenfessListAction(
  params: GetMenfessListActionParams = {}
): Promise<ActionResult<MenfessListData>> {
  try {
    const page = sanitizePage(params.page)
    const limit = sanitizeLimit(params.limit)
    const from = (page - 1) * limit
    const to = from + limit - 1
    const supabase = createSupabasePublishableClient()

    const { data, error, count } = await supabase
      .from('menfess')
      .select(MENFESS_SELECT_FIELDS, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      return {
        success: false,
        message: 'Failed to fetch menfess messages.',
        error: error.message
      }
    }

    const total = count ?? 0

    return {
      success: true,
      message: 'Menfess messages fetched successfully.',
      data: {
        items: (data ?? []).map(normalizeMenfessRecord),
        page,
        limit,
        total,
        hasMore: page * limit < total
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'An unexpected error occurred while fetching menfess.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function updateMenfessReactionAction(
  params: UpdateMenfessReactionActionParams
): Promise<ActionResult<MenfessRecord>> {
  try {
    const supabase = createSupabaseSecretClient()

    const { data: current, error: fetchError } = await supabase
      .from('menfess')
      .select(MENFESS_SELECT_FIELDS)
      .eq('id', params.id)
      .single()

    if (fetchError) {
      return {
        success: false,
        message: 'Failed to load menfess reaction state.',
        error: fetchError.message
      }
    }

    if (!current) {
      return {
        success: false,
        message: 'Menfess message not found.',
        error: 'No row was returned from Supabase.'
      }
    }

    const nextReactionCount = Math.max(0, (current[params.reaction] ?? 0) + params.delta)

    if (nextReactionCount === current[params.reaction] && params.delta === -1) {
      return {
        success: false,
        message: 'Menfess reaction is already at zero.',
        error: 'Reaction count cannot go below zero.'
      }
    }

    const { data, error } = await supabase
      .from('menfess')
      .update({
        [params.reaction]: nextReactionCount
      })
      .eq('id', params.id)
      .select(MENFESS_SELECT_FIELDS)
      .single()

    if (error) {
      return {
        success: false,
        message: 'Failed to update menfess reaction.',
        error: error.message
      }
    }

    if (!data) {
      return {
        success: false,
        message: 'Menfess reaction was not returned after update.',
        error: 'No row was returned from Supabase.'
      }
    }

    revalidatePath('/fun-corners')

    return {
      success: true,
      message: 'Menfess reaction updated successfully.',
      data: normalizeMenfessRecord(data)
    }
  } catch (error) {
    return {
      success: false,
      message: 'An unexpected error occurred while updating menfess reaction.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
