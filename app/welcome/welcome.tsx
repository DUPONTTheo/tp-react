import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";
import { VpButton } from '@vtmn-play/react';

export function Welcome() {
  return (
    <main className="flex flex-col items-center justify-center gap-4 h-svh">
      <VpButton type='submit' size='small' className='col-span-1'>
        Hell world
      </VpButton>
    </main>
  );
}