import Link from 'next/link';
import { useRouter } from 'next/router';
import { PostFAB } from './postFAB';
import {
  COMPOSE_TWEET_ROUTE,
  HOME_ROUTE,
  MESSAGES_ROUTE,
  PROFILE_ROUTE,
  SEARCH_ROUTE,
} from '../utilities/constants';

export function Nav() {
  const router = useRouter();
  const pathname = router.pathname;

  return (
    <nav
      data-testid="nav"
      className="sm:border-r-[1px] sm:flex sm:flex-col sm:items-center sm:pt-14 sm:h-screen md:items-end md:pr-5 xl:pl-6"
    >
      <ul className="fixed bg-white bottom-0 left-0 w-full flex justify-around border-t-[1px] sm:flex-col sm:static sm:w-min sm:border-none xl:w-full">
        {createNavLink({
          href: HOME_ROUTE,
          label: 'Home',
          icon: (
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className={`stroke-black stroke-1 w-7 h-7 ${
                isHome(pathname) ? 'fill-black' : 'fill-white stroke-2'
              }`}
            >
              <g>
                <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z"></path>
              </g>
            </svg>
          ),
        })}
        {createNavLink({
          href: SEARCH_ROUTE,
          label: 'Search',
          icon: (
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className={`fill-black stroke-black w-7 h-7 ${
                isSearch(pathname) ? 'stroke-1' : 'stroke-[0.5px]'
              }`}
            >
              <g>
                <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
              </g>
            </svg>
          ),
        })}
        {createNavLink({
          href: '/username',
          label: 'Profile',
          icon: (
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className={`stroke-black stroke-1 w-7 h-7 ${
                isProfile(pathname) ? 'fill-black' : 'fill-white stroke-2'
              }`}
            >
              <g>
                <path d="M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z"></path>
              </g>
            </svg>
          ),
        })}
        {createNavLink({
          href: MESSAGES_ROUTE,
          label: 'Messages',
          icon: (
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className={`stroke-black stroke-0 w-7 h-7 ${
                isMessages(pathname) ? 'fill-black' : 'fill-white stroke-2'
              }`}
            >
              <g>
                <path d="M1.998 4.499c0-.828.671-1.499 1.5-1.499h17c.828 0 1.5.671 1.5 1.499v2.858l-10 4.545-10-4.547V4.499zm0 5.053V19.5c0 .828.671 1.5 1.5 1.5h17c.828 0 1.5-.672 1.5-1.5V9.554l-10 4.545-10-4.547z"></path>
              </g>
            </svg>
          ),
          // icon: (
          //   <svg
          //     viewBox="0 0 24 24"
          //     aria-hidden="true"
          //     className={`stroke-black stroke-0 w-7 h-7 ${
          //       isMessages() ? 'fill-black' : 'fill-white stroke-2'
          //     }`}
          //   >
          //     <g>
          //       <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path>
          //     </g>
          //   </svg>
          // ),
        })}
      </ul>
      <div className="fixed bottom-24 right-5 sm:static xl:hidden">
        {canPostFABBeDisplayed(pathname) && <PostFAB />}
      </div>
    </nav>
  );

  function createNavLink({
    href,
    label,
    icon,
  }: {
    href: string;
    label: string;
    icon: JSX.Element;
  }) {
    return (
      <Link href={href} aria-label={label}>
        <li className="text-xl flex gap-4 hover:bg-slate-200 rounded-full p-3 transition lg:w-min">
          {icon}
          <span
            className={`${
              pathname === href ? 'font-bold' : ''
            } hidden xl:inline-block`}
          >
            {label}
          </span>
        </li>
      </Link>
    );
  }

  function isHome(pathname: string) {
    return pathname === HOME_ROUTE;
  }

  function isProfile(pathname: string) {
    return pathname === PROFILE_ROUTE;
  }

  function isSearch(pathname: string) {
    return pathname === '/search';
  }

  function isMessages(pathname: string) {
    return pathname === MESSAGES_ROUTE;
  }

  function canPostFABBeDisplayed(pathname: string) {
    if (isMessages(pathname) || isComposeTweet(pathname)) return false;
    return true;
  }

  function isComposeTweet(pathname: string): boolean {
    return pathname == COMPOSE_TWEET_ROUTE;
  }
}
