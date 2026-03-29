'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { LoginForm } from '@/components/LoginForm';
import { useEffect, useLayoutEffect, useRef, useState, Suspense } from 'react';
import { cn } from '@/lib/utils';

export default function LoginModalPage() {
  return (
    <Suspense fallback={null}>
      <LoginModal />
    </Suspense>
  );
}

function LoginModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const pathname = usePathname();

  const [btnPos, setBtnPos] = useState<{ x: number; y: number } | null>(null);
  const [offsets, setOffsets] = useState<{ tx: number; ty: number }>({
    tx: 0,
    ty: 0,
  });
  const [phase, setPhase] = useState<'closed' | 'open' | 'closing'>('closed');

  // Read button position and calculate stable offsets on mount
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    let pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    try {
      const raw = sessionStorage.getItem('loginBtnOrigin');
      if (raw) {
        pos = JSON.parse(raw);
      }
    } catch (_) {}

    setBtnPos(pos);
    setOffsets({
      tx: pos.x - window.innerWidth / 2,
      ty: pos.y - window.innerHeight / 2,
    });

    // Trigger opening phases immediately after setting position
    // requestAnimationFrame ensures the browser has the 'closed' state at the origin
    // before starting the transition to 'open'.
    const id = requestAnimationFrame(() => {
      setPhase('open');
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Clear session storage once we've successfully opened the modal
  useEffect(() => {
    if (phase === 'open') {
      sessionStorage.removeItem('loginBtnOrigin');
    }
  }, [phase]);

  if (pathname !== '/login') return null;

  const dismiss = () => {
    router.back();
  };

  const isClosed = phase === 'closed' || phase === 'closing';
  const isOpen = phase === 'open';

  const cardStyle: React.CSSProperties = {
    transform: isClosed
      ? `translate(${offsets.tx}px, ${offsets.ty}px) scale(0.01)`
      : `translate(0px, 0px) scale(1)`,
    opacity: isClosed ? 0 : 1,
    transition:
      phase === 'open'
        ? 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease'
        : 'none',
    transformOrigin: 'center center',
    willChange: 'transform, opacity',
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        isClosed ? 'pointer-events-none' : ''
      )}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={cn(
          'absolute inset-0 bg-black/10 backdrop-blur-sm',
          isClosed ? 'pointer-events-none' : ''
        )}
        style={{
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 320ms ease',
        }}
        onClick={dismiss}
        aria-label="Close modal"
      />
      {/* Only render card when we have a button position to animate from */}
      {btnPos && (
        <div className="relative z-10 w-full max-w-md mx-4" style={cardStyle}>
          <Suspense fallback={null}>
            <LoginForm
              onSuccess={() => {
                setPhase('closing');
                setTimeout(() => {
                  window.location.replace(callbackUrl || '/');
                }, 300);
              }}
              onRegisterClick={() => {
                setPhase('closing');
                setTimeout(() => {
                  router.back();
                  setTimeout(() => {
                    window.location.href = '/register';
                  }, 50);
                }, 280);
              }}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
