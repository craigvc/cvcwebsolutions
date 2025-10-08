'use client'

import { Share2, Facebook, Twitter, Linkedin } from 'lucide-react'

interface ShareButtonsProps {
  url: string
  title: string
  excerpt: string
}

export default function ShareButtons({ url, title, excerpt }: ShareButtonsProps) {
  const fullUrl = `https://cvcwebsolutions.com${url}`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: excerpt,
          url: fullUrl
        })
      } catch (err) {
        // User cancelled share or error occurred
      }
    } else {
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(fullUrl)
        alert('Link copied to clipboard!')
      } catch (err) {
        alert('Failed to copy link')
      }
    }
  }

  return (
    <div className="pt-8 mt-12 border-t border-gray-200 dark:border-gray-700">
      <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        <Share2 className="w-5 h-5 text-purple-500" />
        Share this article
      </h3>
      <div className="flex flex-wrap gap-3">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1877F2] rounded-lg hover:bg-[#0C63D4] transition-colors"
        >
          <Facebook className="w-4 h-4" />
          Facebook
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1DA1F2] rounded-lg hover:bg-[#0C85D0] transition-colors"
        >
          <Twitter className="w-4 h-4" />
          Twitter
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0A66C2] rounded-lg hover:bg-[#004182] transition-colors"
        >
          <Linkedin className="w-4 h-4" />
          LinkedIn
        </a>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          More
        </button>
      </div>
    </div>
  )
}
