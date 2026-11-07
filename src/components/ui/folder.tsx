"use client";

import { cn } from "@/lib/utils";

type FolderProps = {
  label?: string;
  className?: string;
  onOpenChange?: (open: boolean) => void;
};

/**
 * Exact Folder from https://21st.dev/@ravikatiyar162/components/folder
 * Amber manila folder — papers lift on hover via CSS 3D rotateX.
 */
export function Folder({ label = "Folder", className, onOpenChange }: FolderProps) {
  return (
    <section
      className={cn(
        "relative group flex flex-col items-center justify-center",
        className,
      )}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={label}
        data-ui-sound="folder"
        className="file relative w-[96px] h-16 cursor-pointer origin-bottom [perspective:1000px] z-50"
        onClick={() => onOpenChange?.(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpenChange?.(true);
          }
        }}
      >
        {/* Back panel + left tab */}
        <div className="work-5 bg-amber-600 w-full h-full origin-top rounded-lg rounded-tl-none group-hover:shadow-[0_10px_20px_rgba(0,0,0,.2)] transition-all ease duration-300 relative after:absolute after:content-[''] after:bottom-[99%] after:left-0 after:w-8 after:h-2 after:bg-amber-600 after:rounded-t-lg before:absolute before:content-[''] before:-top-[6px] before:left-[30px] before:w-2 before:h-2 before:bg-amber-600 before:[clip-path:polygon(0_35%,0%_100%,50%_100%)]" />

        {/* Paper layers */}
        <div className="work-4 absolute inset-0.5 bg-zinc-400 rounded-lg transition-all ease duration-300 origin-bottom select-none group-hover:[transform:rotateX(-20deg)]" />
        <div className="work-3 absolute inset-0.5 bg-zinc-300 rounded-lg transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-30deg)]" />
        <div className="work-2 absolute inset-0.5 bg-zinc-200 rounded-lg transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-38deg)]" />

        {/* Front flap + right tab */}
        <div className="work-1 absolute bottom-0 bg-gradient-to-t from-amber-500 to-amber-400 w-full h-[62px] rounded-lg rounded-tr-none after:absolute after:content-[''] after:bottom-[99%] after:right-0 after:w-[58px] after:h-[6px] after:bg-amber-400 after:rounded-t-lg before:absolute before:content-[''] before:-top-[4px] before:right-[56px] before:size-1.5 before:bg-amber-400 before:[clip-path:polygon(100%_14%,50%_100%,100%_100%)] transition-all ease duration-300 origin-bottom flex items-end group-hover:shadow-[inset_0_10px_20px_#fbbf24,_inset_0_-10px_20px_#d97706] group-hover:[transform:rotateX(-46deg)_translateY(1px)]" />
      </div>

      {label ? (
        <p className="mac-desktop__folder-caption pt-2">{label}</p>
      ) : null}
    </section>
  );
}

export default Folder;
