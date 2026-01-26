interface Props {
  className?: string;
  title: string;
}

export const ExtLink = ({ className, title }: Props) => (
  <svg
    className={`ml-1 inline h-[1.25em] w-4 fill-ax-accent-800 align-top ${className ?? ''}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    aria-hidden
  >
    <title>{title}</title>
    <path d="M8 2.667V4H1.333v10.667H12V8h1.333v8H0V2.667h8zM16 0v6h-1.333V2.276l-7.772 7.771-.942-.942 7.77-7.772H10V0h6z" />
  </svg>
);
