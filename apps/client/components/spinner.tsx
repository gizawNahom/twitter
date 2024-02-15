import { ReactNode } from 'react';

export function Spinner() {
  return (
    <Container>
      <div
        data-testid="spinner"
        className={
          'border-cyan-500 align-middle inline-block h-5 w-5 animate-spin rounded-full border-[3px] border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]'
        }
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </Container>
  );

  function Container({ children }: { children: ReactNode }) {
    return (
      <div className="min-h-[150px] flex justify-center items-center">
        {children}
      </div>
    );
  }
}
