import Image from "next/image";

const FINDER = "/icons/finder";

type ImgProps = {
  className?: string;
  alt?: string;
};

function SidebarIcon({
  src,
  className = "size-4",
  alt = "",
}: ImgProps & { src: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={64}
      height={64}
      className={className}
      unoptimized
      draggable={false}
    />
  );
}

/** Favourites — About Me (Home) */
export function IconAbout({ className, alt }: ImgProps) {
  return (
    <SidebarIcon
      src={`${FINDER}/sidebar-about.png`}
      className={className}
      alt={alt}
    />
  );
}

/** Favourites — Experience (Time Machine) */
export function IconExperience({ className, alt }: ImgProps) {
  return (
    <SidebarIcon
      src={`${FINDER}/sidebar-experience.png`}
      className={className}
      alt={alt}
    />
  );
}

/** Favourites — Projects (Desktop) */
export function IconProjects({ className, alt }: ImgProps) {
  return (
    <SidebarIcon
      src={`${FINDER}/sidebar-projects.png`}
      className={className}
      alt={alt}
    />
  );
}

/** Favourites — Skills (Applications) */
export function IconSkills({ className, alt }: ImgProps) {
  return (
    <SidebarIcon
      src={`${FINDER}/sidebar-skills.png`}
      className={className}
      alt={alt}
    />
  );
}

/** Favourites — Resume (Document) */
export function IconResume({ className, alt }: ImgProps) {
  return (
    <SidebarIcon
      src={`${FINDER}/sidebar-resume.png`}
      className={className}
      alt={alt}
    />
  );
}

/** Favourites — Recents */
export function IconRecents({ className, alt }: ImgProps) {
  return (
    <SidebarIcon
      src={`${FINDER}/sidebar-recents.png`}
      className={className}
      alt={alt}
    />
  );
}

export function IconApplications({ className, alt }: ImgProps) {
  return (
    <SidebarIcon
      src={`${FINDER}/sidebar-applications.png`}
      className={className}
      alt={alt}
    />
  );
}

export function IconDownloads({ className, alt }: ImgProps) {
  return (
    <SidebarIcon
      src={`${FINDER}/sidebar-downloads.png`}
      className={className}
      alt={alt}
    />
  );
}

export function IconDesktop({ className, alt }: ImgProps) {
  return (
    <SidebarIcon
      src={`${FINDER}/sidebar-desktop.png`}
      className={className}
      alt={alt}
    />
  );
}

export function IconDocuments({ className, alt }: ImgProps) {
  return (
    <SidebarIcon
      src={`${FINDER}/sidebar-documents.png`}
      className={className}
      alt={alt}
    />
  );
}

export function IconFolderLarge({
  className = "w-full h-full",
  alt = "",
  variant = "folder",
}: ImgProps & {
  variant?:
    | "folder"
    | "folder-applications"
    | "folder-documents"
    | "folder-downloads"
    | "folder-desktop";
}) {
  return (
    <Image
      src={`${FINDER}/${variant}.png`}
      alt={alt}
      width={256}
      height={256}
      className={className}
      unoptimized
      draggable={false}
    />
  );
}

export function IconViewIcons({ active = false }: { active?: boolean }) {
  const c = active ? "#0A84FF" : "currentColor";
  return (
    <svg className="size-3.5" viewBox="0 0 16 16" fill={c} aria-hidden>
      <rect x="2" y="2" width="5" height="5" rx="1" />
      <rect x="9" y="2" width="5" height="5" rx="1" />
      <rect x="2" y="9" width="5" height="5" rx="1" />
      <rect x="9" y="9" width="5" height="5" rx="1" />
    </svg>
  );
}

export function IconViewList({ active = false }: { active?: boolean }) {
  const c = active ? "#0A84FF" : "currentColor";
  return (
    <svg className="size-3.5" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2 3.5h12M2 8h12M2 12.5h12"
        stroke={c}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconViewColumns({ active = false }: { active?: boolean }) {
  const c = active ? "#0A84FF" : "currentColor";
  return (
    <svg className="size-3.5" viewBox="0 0 16 16" fill={c} aria-hidden>
      <rect x="2" y="2" width="3.5" height="12" rx="0.8" />
      <rect x="6.25" y="2" width="3.5" height="12" rx="0.8" />
      <rect x="10.5" y="2" width="3.5" height="12" rx="0.8" />
    </svg>
  );
}

export function IconViewGallery({ active = false }: { active?: boolean }) {
  const c = active ? "#0A84FF" : "currentColor";
  return (
    <svg className="size-3.5" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect
        x="2"
        y="3"
        width="12"
        height="10"
        rx="1.5"
        stroke={c}
        strokeWidth="1.4"
      />
      <path
        d="M2 11.5l3.2-3 2.3 2.2 3-3.7L14 11.5"
        stroke={c}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
