import Link from 'next/link';
import { useRouter } from 'next/router';
import { PostFAB } from './postFAB';

export function Nav() {
  const router = useRouter();

  return (
    <nav
      data-testid="nav"
      className="sm:border-r-[1px] sm:basis-1/6 sm:flex sm:flex-col sm:items-center sm:pt-14 sm:h-screen md:items-end md:pr-5 xl:basis-1/4 xl:pl-12"
    >
      <ul className="absolute bottom-0 left-0 w-full flex justify-center border-t-[1px] sm:static sm:w-min sm:border-none xl:w-full">
        <Link href="/home" aria-label="Home">
          <li className="text-xl flex gap-4 hover:bg-slate-200 rounded-full p-3 transition lg:w-min">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className={`stroke-black stroke-1 w-7 h-7 ${
                isHome() ? 'fill-black' : 'fill-white stroke-2'
              }`}
            >
              <g>
                <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z"></path>
              </g>
            </svg>
            <span
              className={`${
                isHome() ? 'font-bold' : ''
              } hidden xl:inline-block`}
            >
              Home
            </span>
          </li>
        </Link>
      </ul>
      <div className="absolute bottom-20 right-5 sm:static xl:hidden">
        <PostFAB />
      </div>
    </nav>
  );

  function isHome() {
    return router.pathname === '/home';
  }
}
