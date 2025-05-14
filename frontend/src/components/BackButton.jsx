import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 *  Universal back button — sits in the top-right corner,
 *  does not push other content around.
 *
 *  Usage:  <BackButton />   (place it once *anywhere* in your page JSX)
 */
export default function BackButton({ className = '' }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      aria-label="Go back"
      className={`
        fixed md:absolute               /* stays put, never affects layout   */
        top-20 right-8 z-40              /* top-right, above everything else  */
        flex items-center gap-1
        rounded-full bg-blue-600 hover:bg-blue-800
        shadow px-3 py-2 text-sm font-medium text-white
        transition-colors
        active:scale-95
        ${className}                    /* optional overrides                */
      `}
    >
      <ArrowLeft size={16} />
      <span className="hidden sm:inline">Back</span>
    </button>
  );
}
