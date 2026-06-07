'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

import { getMenfessListAction, updateMenfessReactionAction } from '@/actions/menfess'

import MenfessCard from '../../molecules/MenfessCard'
import type { MenfessRecord, MenfessReactionName } from '@/types/menfess'

const ITEMS_PER_PAGE = 6
const getReactionStateKey = (id: string, reaction: MenfessReactionName) =>
  `menfess-reaction-state:${id}:${reaction}`

type MenfessProps = {
  initialPage?: number
}

const sanitizePage = (page: number) => {
  if (!Number.isFinite(page)) {
    return 1
  }

  return Math.max(1, Math.floor(page))
}

const getPageFromCurrentUrl = () => {
  if (typeof window === 'undefined') {
    return 1
  }

  const page = Number.parseInt(
    new URLSearchParams(window.location.search).get('page') ?? '',
    10
  )

  return sanitizePage(page)
}

const updatePageInUrl = (page: number, mode: 'push' | 'replace' = 'push') => {
  if (typeof window === 'undefined') {
    return
  }

  const url = new URL(window.location.href)
  url.searchParams.set('page', String(sanitizePage(page)))

  const nextUrl = `${url.pathname}${url.search}${url.hash}`

  if (nextUrl === `${window.location.pathname}${window.location.search}${window.location.hash}`) {
    return
  }

  if (mode === 'replace') {
    window.history.replaceState(null, '', nextUrl)
    return
  }

  window.history.pushState(null, '', nextUrl)
}

const getReactionStatesForItems = (items: MenfessRecord[]) => {
  if (typeof window === 'undefined') {
    return {}
  }

  const nextStates: Record<string, Partial<Record<MenfessReactionName, boolean>>> = {}

  items.forEach((item) => {
    nextStates[item.id] = {
      laugh: window.localStorage.getItem(getReactionStateKey(item.id, 'laugh')) === '1',
      love: window.localStorage.getItem(getReactionStateKey(item.id, 'love')) === '1',
      sad: window.localStorage.getItem(getReactionStateKey(item.id, 'sad')) === '1',
      angry: window.localStorage.getItem(getReactionStateKey(item.id, 'angry')) === '1'
    }
  })

  return nextStates
}

const getPaginationItems = (
  currentPage: number,
  totalPages: number
) => {
  const pages: (number | string)[] = []

  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, i) => i + 1
    )
  }

  pages.push(1)

  let startPage = Math.max(2, currentPage - 1)
  let endPage = Math.min(totalPages - 1, currentPage + 1)

  if (currentPage <= 4) {
    startPage = 2
    endPage = 5
  }

  if (currentPage >= totalPages - 3) {
    startPage = totalPages - 4
    endPage = totalPages - 1
  }

  if (startPage > 2) {
    pages.push('...')
  }

  for (let page = startPage; page <= endPage; page += 1) {
    pages.push(page)
  }

  if (endPage < totalPages - 1) {
    pages.push('...')
  }

  pages.push(totalPages)

  return pages
}

const Menfess = ({ initialPage = 1 }: MenfessProps) => {
  const [currentPage, setCurrentPage] = useState(() => sanitizePage(initialPage))
  const [items, setItems] = useState<MenfessRecord[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [updatingReactionId, setUpdatingReactionId] = useState<string | null>(null)
  const [reactionStates, setReactionStates] = useState<Record<string, Partial<Record<MenfessReactionName, boolean>>>>({})

  useEffect(() => {
    let ignore = false

    const loadMenfess = async () => {
      setLoading(true)

      const result = await getMenfessListAction({
        page: currentPage,
        limit: ITEMS_PER_PAGE
      })

      if (result.success && result.data) {
        const nextTotalPages = Math.max(
          1,
          Math.ceil(
            result.data.total /
              ITEMS_PER_PAGE
          )
        )

        if (ignore) {
          return
        }

        if (currentPage > nextTotalPages) {
          setTotalPages(nextTotalPages)
          setCurrentPage(nextTotalPages)
          updatePageInUrl(nextTotalPages, 'replace')
          return
        }

        setItems(result.data.items)
        setReactionStates(getReactionStatesForItems(result.data.items))
        setTotalPages(nextTotalPages)
      }

      if (!ignore) {
        setLoading(false)
      }
    }

    loadMenfess()

    return () => {
      ignore = true
    }
  }, [currentPage, refreshKey])

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getPageFromCurrentUrl())
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    const handleMenfessCreated = () => {
      updatePageInUrl(1, 'replace')

      if (currentPage === 1) {
        setRefreshKey((previousKey) => previousKey + 1)
        return
      }

      setCurrentPage(1)
    }

    window.addEventListener('menfess:created', handleMenfessCreated)

    return () => {
      window.removeEventListener('menfess:created', handleMenfessCreated)
    }
  }, [currentPage])

  const goToPage = (page: number) => {
    const nextPage = Math.min(totalPages, sanitizePage(page))

    updatePageInUrl(nextPage)
    setCurrentPage(nextPage)
  }

  const setReactionState = (id: string, reaction: MenfessReactionName, active: boolean) => {
    if (typeof window !== 'undefined') {
      const storageKey = getReactionStateKey(id, reaction)

      if (active) {
        window.localStorage.setItem(storageKey, '1')
      } else {
        window.localStorage.removeItem(storageKey)
      }
    }

    setReactionStates((previousStates) => ({
      ...previousStates,
      [id]: {
        ...previousStates[id],
        [reaction]: active
      }
    }))
  }

  const handleReactionClick = async (
    id: string | number,
    reaction: MenfessReactionName
  ) => {
    const targetId = String(id)
    const isActive = Boolean(reactionStates[targetId]?.[reaction])

    setUpdatingReactionId(targetId)
    setItems((previousItems) =>
      previousItems.map((item) =>
        item.id === targetId
          ? {
              ...item,
              [reaction]: Math.max(0, item[reaction] + (isActive ? -1 : 1))
            }
          : item
      )
    )

    const result = await updateMenfessReactionAction({
      id: targetId,
      reaction,
      delta: isActive ? -1 : 1
    })

    if (result.success && result.data) {
      setReactionState(targetId, reaction, !isActive)
      setItems((previousItems) =>
        previousItems.map((item) =>
          item.id === targetId ? result.data! : item
        )
      )
    } else {
      setItems((previousItems) =>
        previousItems.map((item) =>
          item.id === targetId
            ? {
                ...item,
                [reaction]: Math.max(0, item[reaction] - 1)
              }
            : item
        )
      )
    }

    setUpdatingReactionId(null)
  }

  return (
    <section 
      id="menfess-container" 
      className="bg-blue-cs-40 relative z-10 flex w-full items-center justify-center pb-24 px-6 lg:px-4"
    >
      <Image
          src="/assets/images/fess-bg.png" // Langsung gunakan path dari root
          alt="Menfess Background"
          draggable={false}
          fill
          priority
          className="object-cover object-top -z-10 mix-blend-color-dodge pointer-events-none select-none"
      />

      <div className="from-[#0B1E38] to-[#173679]/0 absolute inset-0 bg-gradient-to-b pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-[1200px] flex flex-col gap-10">
        {/* Container Cards: flex-col untuk Mobile, md:grid-cols-2 untuk Desktop */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-6 w-full">
          {loading ? (
            <div className="col-span-2 py-20 text-center text-white">
              Loading...
            </div>
          ) : items.length === 0 ? (
            <div className="col-span-2 py-20 text-center text-white">
              No menfess found.
            </div>
          ) : (
            items.map((data) => (
              <MenfessCard
                key={data.id}
                id={data.id}
                from={data.from ?? '-'}
                to={data.to ?? '-'}
                message={data.message}
                timestamp={new Date(data.created_at).toLocaleString()}
                onReactionClick={
                  updatingReactionId === data.id ? undefined : handleReactionClick
                }
                activeReactions={reactionStates[data.id]}
                reactions={{
                  laugh: data.laugh ?? 0,
                  love: data.love ?? 0,
                  sad: data.sad ?? 0,
                  angry: data.angry ?? 0
                }}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <nav
            className="mt-4 flex flex-wrap items-center justify-center gap-2 text-white"
            aria-label="Menfess pagination"
          >
            {/* Prev */}
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                goToPage(currentPage - 1)
              }
              aria-label="Go to previous page"
              className={`
                flex h-8 w-8 items-center justify-center rounded transition
                ${
                  currentPage === 1
                    ? 'cursor-not-allowed opacity-40'
                    : 'hover:bg-white/10 cursor-pointer'
                }
              `}
            >
              &lt;
            </button>

            {getPaginationItems(
              currentPage,
              totalPages
            ).map((item, index) => {
              if (item === '...') {
                return (
                  <span
                    key={`dots-${index}`}
                    className="flex h-8 min-w-6 items-center justify-center px-1 text-white/70"
                    aria-hidden="true"
                  >
                    ...
                  </span>
                )
              }

              return (
                <button
                  type="button"
                  key={item}
                  onClick={() =>
                    goToPage(item as number)
                  }
                  aria-current={currentPage === item ? 'page' : undefined}
                  aria-label={`Go to page ${item}`}
                  className={`
                    flex h-8 w-8 items-center justify-center rounded transition
                    ${
                      currentPage === item
                        ? 'bg-white font-bold text-[#0B1E38]'
                        : 'border border-white hover:bg-white/10 cursor-pointer'
                    }
                  `}
                >
                  {item}
                </button>
              )
            })}

            {/* Next */}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                goToPage(currentPage + 1)
              }
              aria-label="Go to next page"
              className={`
                flex h-8 w-8 items-center justify-center rounded transition
                ${
                  currentPage === totalPages
                    ? 'cursor-not-allowed opacity-40'
                    : 'hover:bg-white/10 cursor-pointer'
                }
              `}
            >
              &gt;
            </button>
          </nav>
        )}
      </div>
    </section>
  )
}

export default Menfess
