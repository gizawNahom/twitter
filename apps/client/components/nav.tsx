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
      <ul className="fixed bg-white bottom-0 left-0 w-full flex justify-around border-t-[1px] sm:flex-col sm:static sm:w-min sm:border-none xl:w-full">
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
        <Link href="/username" aria-label="Home">
          <li className="text-xl flex gap-4 hover:bg-slate-200 rounded-full p-3 transition lg:w-min">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className={`stroke-black stroke-1 w-7 h-7 ${
                isProfile() ? 'fill-black' : 'fill-white stroke-2'
              }`}
            >
              <g>
                <path d="M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z"></path>
              </g>
            </svg>
            <span
              className={`${
                isProfile() ? 'font-bold' : ''
              } hidden xl:inline-block`}
            >
              Profile
            </span>
          </li>
        </Link>
      </ul>
      <div className="fixed bottom-24 right-5 sm:static xl:hidden">
        {router.pathname !== '/compose/tweet' && <PostFAB />}
      </div>
    </nav>
  );

  function isHome() {
    return router.pathname === '/home';
  }

  function isProfile() {
    return router.pathname === '/username';
  }
}
