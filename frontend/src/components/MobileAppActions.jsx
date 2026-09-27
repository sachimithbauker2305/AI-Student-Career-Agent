import React, { useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';

export default function MobileAppActions() {
  const [copied, setCopied] = useState(false);

  const getAppUrl = () => import.meta.env.VITE_PUBLIC_APP_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://10.84.18.103:5173' : window.location.origin);

  const shareOrCopy = async () => {
    const shareUrl = getAppUrl();
    const shareData = {
      title: 'NextStep',
      text: 'NextStep',
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error?.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt('Copy this NextStep link:', shareUrl);
    }
  };

  return (
    <button
      type="button"
      onClick={shareOrCopy}
      className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-transparent px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10 hover:text-white transition-colors"
    >
      {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
      {copied ? 'Link copied' : 'Share NextStep'}
    </button>
  );
}
