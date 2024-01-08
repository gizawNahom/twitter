import Link from 'next/link';
import { useRouter } from 'next/router';

export function Nav() {
  const router = useRouter();

  return (
    <nav className=" basis-1/4 flex flex-col items-center pl-14 pt-14">
      <ul>
        <Link href="/home">
          <li className=" text-xl flex gap-4 hover:bg-slate-200 rounded-full py-2 px-4 transition">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              width="30px"
              height="30px"
              className={`stroke-black stroke-1 ${
                isHome() ? 'fill-black' : 'fill-white'
              }`}
            >
              <g>
                <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z"></path>
              </g>
            </svg>
            <span className={isHome() ? 'font-bold' : ''}>Home</span>
          </li>
        </Link>
      </ul>
    </nav>
  );

  function isHome() {
    return router.pathname === '/home';
  }
}
